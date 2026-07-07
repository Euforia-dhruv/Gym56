// Centralized configuration for Gym56
export const CONFIG = {
  WHATSAPP_NUMBER: "91992441179",
  WHATSAPP_MESSAGE: "Hello Gym56! I'm interested in joining your gym. Please share membership details.",
  get whatsappUrl() {
    return `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(this.WHATSAPP_MESSAGE)}`;
  },
  PHONE: "+919924441179",
  INSTAGRAM: "https://www.instagram.com/gym56_gandhinagar",
  MAPS: "https://maps.app.goo.gl/Y4VNHVrCJjX1HCUx6",
};
