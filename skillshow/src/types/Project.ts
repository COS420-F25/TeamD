export interface Project {
    id: string;
    title: string;
    desc: string;
    tags: string[];
    fields: {
        id: string;
        label: string;
        value: string;
    }[];
    userId: string;
    createdAt: any;
}