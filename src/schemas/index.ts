export type Video = {
  id?: string;
  title: string;
  cover: string;
  start?: Date | string;
  end?: Date | string | null;
  total: number;
  current: number;
  type: number;
};
