import { ConfigType } from '@/providers'

export const loadConfigFromFile = async () => {
  let defaultConfig;
  try {
    const defaultPublicConfigFile = await fetch("/config.default.json");
    defaultConfig = await defaultPublicConfigFile.json();
  } catch {
    throw new Error("Default config does not exist in the public directory");
  }

  let overrideConfig;
  try {
    const overrideConfigFile = await fetch("/env-config.json");
    overrideConfig = await overrideConfigFile.json();
  } catch {
    console.info("File env-config.json not specified or wrong format (requires json). Using default config...");
    return defaultConfig;
  }

  console.info("Using merged (default with override) config...");
  return mergeConfig(defaultConfig, overrideConfig);
}

const mergeConfig = (defaultConfig: ConfigType, overrideConfig: ConfigType) => {
  const initialConfigKeys = Object.keys(defaultConfig)
  const overrideConfigMatchingKeys = Object.keys(overrideConfig).filter((key) => initialConfigKeys.includes(key))

  overrideConfigMatchingKeys.forEach((key) => {
    // @ts-ignore: types will always match here, because of using the same key for both objects
    defaultConfig[key] = overrideConfig[key]
  })

  return defaultConfig
}
