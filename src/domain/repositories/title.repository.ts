import { Title } from '../entities/title.entity';

export interface TitleRepository {
  findById(id: string): Promise<Title | null>;
  findAll(): Promise<Title[]>;
  save(title: Title): Promise<Title>;
  delete(id: string): Promise<void>;
}
