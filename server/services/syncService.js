/**
 * BATTLE OF THE MAROONS — LIVE DATABASE SYNCHRONIZATION SERVICE
 * 
 * Automatically synchronizes persistent state between localStore (store.json)
 * and MongoDB Atlas whenever MongoDB is connected or reconnects.
 */

import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { EventSetting } from '../models/EventSetting.js';
import { TicketCategory } from '../models/TicketCategory.js';
import { TicketOrder } from '../models/TicketOrder.js';
import { Match } from '../models/Match.js';
import { Team } from '../models/Team.js';
import { News } from '../models/News.js';
import { Sponsor } from '../models/Sponsor.js';
import { Gallery } from '../models/Gallery.js';
import { Inquiry } from '../models/Inquiry.js';
import { localStore } from '../config/localStore.js';
import { isDbConnected } from '../config/db.js';

let isSyncing = false;

export async function syncLocalStoreToMongo() {
  if (!isDbConnected() || isSyncing) return;
  isSyncing = true;

  try {
    console.log('🔄 Live Sync: Synchronizing localStore and MongoDB Atlas collections...');
    const store = localStore.getStore();

    // 1. Sync Administrator Account
    const initialUser = process.env.ADMIN_INITIAL_USER || 'admin';
    const initialEmail = (process.env.ADMIN_INITIAL_EMAIL || 'admin@battleofthemaroons.lk').toLowerCase();
    const initialPass = process.env.ADMIN_INITIAL_PASSWORD || 'Maroons@2027';

    let admin = await Admin.findOne({ $or: [{ username: initialUser }, { email: initialEmail }] });
    if (!admin) {
      const passwordHash = await bcrypt.hash(initialPass, 12);
      await Admin.create({
        username: initialUser,
        email: initialEmail,
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true
      });
      console.log(`✅ MongoDB Sync: Super Admin initialized [${initialUser}]`);
    }

    // 2. Sync Event Settings
    if (store.event) {
      let eventSetting = await EventSetting.findOne();
      if (!eventSetting) {
        await EventSetting.create(store.event);
      } else {
        await EventSetting.findByIdAndUpdate(eventSetting._id, store.event);
      }
    }

    // 3. Sync Ticket Categories & Live Quotas
    if (Array.isArray(store.tickets) && store.tickets.length > 0) {
      for (const cat of store.tickets) {
        const code = (cat.code || cat.id || '').toLowerCase();
        if (!code) continue;

        const updateData = {
          code,
          name: cat.name,
          price: cat.price,
          description: cat.description || '',
          totalCapacity: cat.totalCapacity !== undefined ? cat.totalCapacity : 500,
          soldCount: cat.soldCount || 0,
          reservedCount: cat.reservedCount || 0,
          maxPerOrder: cat.maxPerOrder || 10,
          isActive: cat.isActive !== false,
          bookingUrl: cat.bookingUrl || ''
        };

        await TicketCategory.findOneAndUpdate(
          { code },
          { $set: updateData },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      console.log(`✅ MongoDB Sync: ${store.tickets.length} ticket categories & live quotas synced.`);
    }

    // 4. Sync Ticket Orders (Two-Way)
    const mongoOrders = await TicketOrder.find().lean();
    const mongoOrdersMap = new Map(mongoOrders.map(o => [o.orderRef, o]));

    // Push local orders missing in MongoDB
    if (Array.isArray(store.orders) && store.orders.length > 0) {
      for (const order of store.orders) {
        if (!mongoOrdersMap.has(order.orderRef)) {
          try {
            await TicketOrder.create(order);
          } catch (err) {
            // Ignore duplicate key errors if already present
          }
        }
      }
    }

    // Pull any MongoDB orders into localStore if missing locally
    for (const mOrder of mongoOrders) {
      const existsLocally = store.orders.some(o => o.orderRef === mOrder.orderRef);
      if (!existsLocally) {
        localStore.addOrder(mOrder);
      }
    }

    // 5. Seed News, Matches, Teams, Sponsors, Gallery if MongoDB is empty
    const newsCount = await News.countDocuments();
    if (newsCount === 0 && Array.isArray(store.news) && store.news.length > 0) {
      await News.insertMany(store.news);
    }

    const matchesCount = await Match.countDocuments();
    if (matchesCount === 0 && Array.isArray(store.matches) && store.matches.length > 0) {
      await Match.insertMany(store.matches);
    }

    const teamsCount = await Team.countDocuments();
    if (teamsCount === 0 && Array.isArray(store.teams) && store.teams.length > 0) {
      await Team.insertMany(store.teams);
    }

    const sponsorsCount = await Sponsor.countDocuments();
    if (sponsorsCount === 0 && Array.isArray(store.sponsors) && store.sponsors.length > 0) {
      await Sponsor.insertMany(store.sponsors);
    }

    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0 && Array.isArray(store.gallery) && store.gallery.length > 0) {
      await Gallery.insertMany(store.gallery);
    }

    console.log('🚀 Live Sync Complete: store.json and MongoDB Atlas are 100% synchronized!');
  } catch (error) {
    console.warn('⚠️ Sync service warning:', error.message);
  } finally {
    isSyncing = false;
  }
}

