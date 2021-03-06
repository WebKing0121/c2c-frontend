export class List {
  listId: number;
  name: string | null;
  description: string | null;
  folderId: number;
  folderName: string;
  type: string;
  lastModificationTime: string | null;
  creationTime: string;
  isDeleted: boolean;
  deleterUserId: number | null;
  deletionTime: string | null;
  lastModifierUserId: number | null;
  creatorUserId: number | null;
  id: number;
}

export class ListValue {
  id: number;
  tenantId: number | null;
  tableName: string;
  value: string;
  displayName: string;
  isDeleted: boolean;
}
