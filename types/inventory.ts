export enum InventoryItemName {
  TOMATOES = "Tomatoes",
  CARTONS_OF_MILK = "Cartons of milk",
  CARTONS_OF_EGGS = "Cartons of eggs",
  BAGS_OF_RICE = "Bags of rice",
}

export const maxQuantities: Record<InventoryItemName, number> = {
  [InventoryItemName.CARTONS_OF_MILK]: 8,
  [InventoryItemName.CARTONS_OF_EGGS]: 24,
  [InventoryItemName.BAGS_OF_RICE]: 10,
  [InventoryItemName.TOMATOES]: 30,
};

export const reorderPoints: Record<InventoryItemName, number> = {
  [InventoryItemName.CARTONS_OF_MILK]: 3,
  [InventoryItemName.CARTONS_OF_EGGS]: 4,
  [InventoryItemName.BAGS_OF_RICE]: 5,
  [InventoryItemName.TOMATOES]: 4,
}; 