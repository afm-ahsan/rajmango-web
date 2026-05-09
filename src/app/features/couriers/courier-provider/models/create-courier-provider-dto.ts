export interface CreateCourierProviderDto {
    id: number;
    name: string;
    description?: string;
    supportPhone?: string;
    email?: string;
    isActive: boolean;
    createdBy: number | null;
    updatedBy: number | null;
}
