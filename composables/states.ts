export const useContactSection = () =>
  useState<boolean>("contact", () => false);
export const useAboutSection = () => useState<boolean>("about", () => false);
export const useModal = () => useState<boolean>("modal", () => false);
export const useCartMode = () => useState<boolean>("cartmode", () => false);
