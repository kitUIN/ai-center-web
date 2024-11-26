export interface PluginModel {
    /**
     * ID
     */
    key: string;
    /**
     * 说明
     */
    info?: string;
    /**
     * 图标
     */
    icon?: string;
    [key: string]: unknown;
  }