import { FeatureIsNotImplementedNowError } from './errors';
import { CWire } from './CWire';

export class CWireFrontendClient {
  public static async openLink(
    clientId: string,
    url: string,
    options: { type: 'tab' | 'popup' | 'current' } = { type: 'current' },
  ) {
    try {
      await CWire.getInstance()
        .getAPI()
        .getAxios()
        .post('/frontend-client/actions/openLink', {
          ...options,
          url,
          clientId,
        });
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async showNotification(clientId: string) {
    throw new FeatureIsNotImplementedNowError();
  }
}
export class FrontendClient extends CWireFrontendClient {}
