import {Api} from '../apptile-common';
import {AppConfig} from '../config';
import {IAppCredentials} from '../types/types';

const apptileServerEndpoint = AppConfig.upstreams.apptileServerEndpoint;

export class ApptileClient {
  static async getAppCredentials(appId: string, platformType: string): Promise<IAppCredentials> {
    const endpoint = apptileServerEndpoint + `/admin/api/apps/${appId}/credentials/${platformType}`;
    const response = await Api.get(endpoint);
    return response.data as IAppCredentials;
  }
}
