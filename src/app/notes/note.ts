export interface Note {
  id?: string;
  title: string;
  description: string;
  date: Date;
  authorId: string;
  authorName?: string; // Add author's name for "Shared by"
  collaborators: string[];
  priority?: string;
}