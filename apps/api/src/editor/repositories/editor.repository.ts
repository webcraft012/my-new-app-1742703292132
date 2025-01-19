import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { editorTable } from '../../database/schema';
import { IEditorRepository } from '../types/editor.repository';
import { CreateEditorDto, UpdateEditorDto, EditorDto } from '@webcraft/types';

@Injectable()
export class EditorRepository implements IEditorRepository {
  constructor(@Inject('DatabaseClient') private client) {}

  async create(editor: CreateEditorDto): Promise<string> {
    const { name, description, state } = editor;

    // Perform the insert and retrieve the last inserted ID
    const result = await this.client
      .insert(editorTable)
      .values({
        name,
        state,
        description,
      } as CreateEditorDto)
      .returning({ id: editorTable.id }); // Specify the field(s) to return

    // Extract the ID from the result
    if (result.length > 0) {
      return result[0].id; // Return the ID of the created row
    }

    throw new Error('Failed to insert editor');
  }

  async update(id: string, editor: UpdateEditorDto) {
    const existingEditor = await this.findOne(id);
    if (!existingEditor) {
      await this.create(editor);
      return;
    }

    await this.client
      .update(editorTable)
      .set(editor)
      .where(eq(editorTable.id, id));
  }

  async delete(id: string) {
    await this.client.delete(editorTable).where(eq(editorTable.id, id));
  }

  async findOne(id: string): Promise<EditorDto | undefined> {
    const result = await this.client
      .select()
      .from(editorTable)
      .where(eq(editorTable.id, id));
    return result[0] ?? undefined;
  }

  async findAll() {
    return this.client.select().from(editorTable);
  }
}
