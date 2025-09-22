import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { db, objects, objectMembers } from '../database';
import { CreateObjectDto, UpdateObjectDto, AddObjectMemberDto, UpdateObjectMemberDto } from '@saas-portal/shared';

@Injectable()
export class ObjectsService {
  async findAll(companyId: string) {
    return db.select().from(objects).where(eq(objects.companyId, companyId)).orderBy(desc(objects.createdAt));
  }

  async findById(id: string, companyId: string) {
    const result = await db.select().from(objects).where(and(eq(objects.id, id), eq(objects.companyId, companyId)));
    
    if (result.length === 0) {
      throw new NotFoundException('Object not found');
    }

    return result[0];
  }

  async create(createObjectDto: CreateObjectDto, companyId: string) {
    const result = await db.insert(objects).values({
      ...createObjectDto,
      companyId,
    }).returning();

    return result[0];
  }

  async update(id: string, updateObjectDto: UpdateObjectDto, companyId: string) {
    await this.findById(id, companyId);

    const result = await db.update(objects)
      .set({
        ...updateObjectDto,
        updatedAt: new Date(),
      })
      .where(and(eq(objects.id, id), eq(objects.companyId, companyId)))
      .returning();

    return result[0];
  }

  async delete(id: string, companyId: string) {
    await this.findById(id, companyId);

    await db.delete(objects).where(and(eq(objects.id, id), eq(objects.companyId, companyId)));

    return { message: 'Object deleted successfully' };
  }

  async getMembers(objectId: string, companyId: string) {
    await this.findById(objectId, companyId);

    return db.select().from(objectMembers).where(eq(objectMembers.objectId, objectId));
  }

  async addMember(objectId: string, addMemberDto: AddObjectMemberDto, companyId: string) {
    await this.findById(objectId, companyId);

    // If setting as responsible, remove responsible flag from other members
    if (addMemberDto.isResponsible) {
      await db.update(objectMembers)
        .set({ isResponsible: false })
        .where(eq(objectMembers.objectId, objectId));
    }

    const result = await db.insert(objectMembers).values({
      objectId,
      ...addMemberDto,
    }).returning();

    return result[0];
  }

  async updateMember(objectId: string, userId: string, updateMemberDto: UpdateObjectMemberDto, companyId: string) {
    await this.findById(objectId, companyId);

    // If setting as responsible, remove responsible flag from other members
    if (updateMemberDto.isResponsible) {
      await db.update(objectMembers)
        .set({ isResponsible: false })
        .where(and(eq(objectMembers.objectId, objectId), eq(objectMembers.userId, userId, 'ne')));
    }

    const result = await db.update(objectMembers)
      .set({
        ...updateMemberDto,
        updatedAt: new Date(),
      })
      .where(and(eq(objectMembers.objectId, objectId), eq(objectMembers.userId, userId)))
      .returning();

    return result[0];
  }

  async removeMember(objectId: string, userId: string, companyId: string) {
    await this.findById(objectId, companyId);

    await db.delete(objectMembers)
      .where(and(eq(objectMembers.objectId, objectId), eq(objectMembers.userId, userId)));

    return { message: 'Member removed successfully' };
  }
}