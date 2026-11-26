export type RobotModel = "mule" | "lifter" | "picker";
export type RobotDirection = "up" | "down" | "left" | "right";

/** Путь к спрайту из `public/robots`, например `/robots/mule/mule_right.svg`. */
export function getRobotSpriteSrc(
  model: RobotModel,
  direction: RobotDirection,
): string {
  return `/robots/${model}/${model}_${direction}.svg`;
}
