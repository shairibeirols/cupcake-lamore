import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// Helper para verificar se é admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Acesso negado. Apenas administradores.' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ CATEGORIES ============
  categories: router({
    list: publicProcedure.query(async () => {
      return db.getAllCategories();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getCategoryById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createCategory(input);
      }),
  }),

  // ============ PRODUCTS ============
  products: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        search: z.string().optional(),
        activeOnly: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAllProducts(input);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await db.getProductById(input.id);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Produto não encontrado' });
        }
        return product;
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const product = await db.getProductBySlug(input.slug);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Produto não encontrado' });
        }
        return product;
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        price: z.number().min(0),
        categoryId: z.number(),
        stock: z.number().min(0).default(0),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        active: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        return db.createProduct(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().min(0).optional(),
        categoryId: z.number().optional(),
        stock: z.number().min(0).optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        active: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateProduct(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteProduct(input.id);
      }),
    
    uploadImage: adminProcedure
      .input(z.object({
        base64: z.string(),
        filename: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Converter base64 para buffer
        const base64Data = input.base64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Gerar nome único
        const ext = input.filename.split('.').pop();
        const fileKey = `products/${nanoid()}.${ext}`;
        
        // Upload para S3
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        
        return { url, fileKey };
      }),
  }),

  // ============ ADDRESSES ============
  addresses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserAddresses(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const address = await db.getAddressById(input.id);
        if (!address || address.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Endereço não encontrado' });
        }
        return address;
      }),
    
    create: protectedProcedure
      .input(z.object({
        recipientName: z.string().min(1),
        street: z.string().min(1),
        number: z.string().min(1),
        complement: z.string().optional(),
        neighborhood: z.string().min(1),
        city: z.string().min(1),
        state: z.string().length(2),
        zipCode: z.string().min(8),
        isDefault: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createAddress({ ...input, userId: ctx.user.id });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        recipientName: z.string().min(1).optional(),
        street: z.string().min(1).optional(),
        number: z.string().min(1).optional(),
        complement: z.string().optional(),
        neighborhood: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        state: z.string().length(2).optional(),
        zipCode: z.string().min(8).optional(),
        isDefault: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const address = await db.getAddressById(id);
        if (!address || address.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Endereço não encontrado' });
        }
        return db.updateAddress(id, { ...data, userId: ctx.user.id });
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const address = await db.getAddressById(input.id);
        if (!address || address.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Endereço não encontrado' });
        }
        return db.deleteAddress(input.id);
      }),
  }),

  // ============ ORDERS ============
  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === 'admin') {
        return db.getAllOrders();
      }
      return db.getUserOrders(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.id);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Pedido não encontrado' });
        }
        // Usuário comum só pode ver seus próprios pedidos
        if (ctx.user.role !== 'admin' && order.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Acesso negado' });
        }
        
        const items = await db.getOrderItems(order.id);
        const address = await db.getAddressById(order.addressId);
        
        return { ...order, items, address };
      }),
    
    create: protectedProcedure
      .input(z.object({
        addressId: z.number(),
        paymentMethod: z.enum(['credit_card', 'pix']),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number().min(1),
        })),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Validar endereço
        const address = await db.getAddressById(input.addressId);
        if (!address || address.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Endereço inválido' });
        }
        
        // Buscar produtos e calcular totais
        let subtotal = 0;
        const orderItemsData = [];
        
        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (!product || !product.active) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: `Produto ${item.productId} não disponível` });
          }
          if (product.stock < item.quantity) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: `Estoque insuficiente para ${product.name}` });
          }
          
          const itemSubtotal = product.price * item.quantity;
          subtotal += itemSubtotal;
          
          orderItemsData.push({
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            quantity: item.quantity,
            subtotal: itemSubtotal,
          });
        }
        
        const shippingFee = 1500; // R$ 15,00 fixo
        const total = subtotal + shippingFee;
        
        // Criar pedido
        const orderResult = await db.createOrder({
          userId: ctx.user.id,
          addressId: input.addressId,
          paymentMethod: input.paymentMethod,
          subtotal,
          shippingFee,
          total,
          notes: input.notes,
          status: 'pending',
        });
        
        const orderId = Number((orderResult as any).insertId);
        
        // Criar itens do pedido
        await db.createOrderItems(
          orderItemsData.map(item => ({ ...item, orderId }))
        );
        
        // Atualizar estoque
        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (product) {
            await db.updateProduct(item.productId, {
              stock: product.stock - item.quantity,
            });
          }
        }
        
        return { orderId, total };
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']),
      }))
      .mutation(async ({ input }) => {
        return db.updateOrderStatus(input.id, input.status);
      }),
  }),

  // ============ DASHBOARD ============
  dashboard: router({
    stats: adminProcedure.query(async () => {
      return db.getDashboardStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
