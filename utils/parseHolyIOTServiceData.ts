import base64 from "react-native-base64";

export function parseHolyIOTServiceData(base64Data: string) {
  const raw = base64.decode(base64Data);
  const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));

  return {
    frameType: bytes[0], // sempre 0x41
    batteryPercent: bytes[1], // 🔥 nível da bateria!
    mac: [
      bytes[2].toString(16).padStart(2, "0"),
      bytes[3].toString(16).padStart(2, "0"),
      bytes[4].toString(16).padStart(2, "0"),
      bytes[5].toString(16).padStart(2, "0"),
      bytes[6].toString(16).padStart(2, "0"),
      bytes[7].toString(16).padStart(2, "0"),
    ].join(":"),
    extra: bytes.slice(8), // infos adicionais
  };
}
