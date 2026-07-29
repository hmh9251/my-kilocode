// kilocode_change - new file
import { registerCustomTheme, type ThemeRegistrationResolved } from "@pierre/diffs"

export const KILO_MARKDOWN_THEME = "KiloLight"

const registrations = (() => {
  const key = Symbol.for("kilocode.ui.kilo-markdown-theme")
  const existing = Reflect.get(globalThis, key)
  if (existing instanceof WeakSet) return existing as WeakSet<typeof registerCustomTheme>

  const value = new WeakSet<typeof registerCustomTheme>()
  Reflect.set(globalThis, key, value)
  return value
})()

export function ensureKiloMarkdownTheme(): void {
  if (registrations.has(registerCustomTheme)) return
  registrations.add(registerCustomTheme)

  registerCustomTheme(KILO_MARKDOWN_THEME, () => {
    return Promise.resolve({
      name: KILO_MARKDOWN_THEME,
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#2c2c2c",
      },
      tokenColors: [
        { scope: ["comment"], settings: { foreground: "#008000" } },
        { scope: ["string", "punctuation.definition.string"], settings: { foreground: "#a31515" } },
        { scope: ["constant.numeric"], settings: { foreground: "#098658" } },
        { scope: ["keyword"], settings: { foreground: "#0000ff" } },
        { scope: ["storage.type", "storage.modifier"], settings: { foreground: "#0000ff" } },
        { scope: ["entity.name.function"], settings: { foreground: "#795e26" } },
        { scope: ["entity.name.type", "support.type"], settings: { foreground: "#267f99" } },
        { scope: ["variable"], settings: { foreground: "#001080" } },
        { scope: ["entity.other.attribute-name"], settings: { foreground: "#264dd9" } },
        { scope: ["support.function"], settings: { foreground: "#795e26" } },
        { scope: ["support.class"], settings: { foreground: "#267f99" } },
        { scope: ["operator"], settings: { foreground: "#2c2c2c" } },
        { scope: ["punctuation"], settings: { foreground: "#2c2c2c" } },
        { scope: ["invalid"], settings: { foreground: "#cd3131" } },
        { scope: ["markup.heading"], settings: { foreground: "#264dd9", fontStyle: "bold" } },
      ],
      semanticTokenColors: {
        comment: "#008000",
        string: "#a31515",
        number: "#098658",
        keyword: "#0000ff",
        variable: "#001080",
        parameter: "#001080",
        property: "#001080",
        function: "#795e26",
        method: "#795e26",
        type: "#267f99",
        class: "#267f99",
        namespace: "#267f99",
      },
    } as unknown as ThemeRegistrationResolved)
  })
}
