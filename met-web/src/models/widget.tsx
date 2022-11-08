export interface WidgetItem {
    id: number;
    widget_id: number;
    widget_data_id: number;
}

export interface Widget {
    id: number;
    widget_type_id: number;
    engagement_id: number;
    items: WidgetItem[];
}

export enum WidgetType {
    WhoIsListening = 1,
}
