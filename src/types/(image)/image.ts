export type BiImage = {
  id: number;
  url: string;
  public_id: string | null;
  file_name: string;
  file_size: number;
  file_type: string;
  width: number | null;
  height: number | null;
  alt: string | null;
  description: string | null;
  user_id: string | null;
  entity_type: string | null;
  entity_id: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export type ImageUploadParams = {
  file: File;
  alt?: string;
  description?: string;
  userId?: string;
  folder?: string;
  entityType?: string;
  entityId?: string;
};

export type ImageUpdateParams = {
  id: number;
  alt?: string;
  description?: string;
};

export type ImageResponse = BiImage;