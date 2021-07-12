export declare class CWireFrontendClient {
    static openLink(clientId: string, url: string, options?: {
        type: 'tab' | 'popup' | 'current';
    }): Promise<boolean>;
    static showNotification(clientId: string): Promise<void>;
}
export declare class FrontendClient extends CWireFrontendClient {
}
