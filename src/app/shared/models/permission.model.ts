export interface PermissionModel {
  area: string;
  featureModels: FeatureModel[];
}

export interface FeatureModel {
  id: number;
  title: string;
  hasAccess: boolean;
  actionModels: ActionModel[];
}

export interface ActionModel{
  id: number;
  action: string;
  hasAccess: boolean;
}