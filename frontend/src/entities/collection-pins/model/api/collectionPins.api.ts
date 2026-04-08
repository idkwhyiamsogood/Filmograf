import { BaseHttpClient } from "@/shared/lib";
import { APIResponse } from "@/shared/types/api";

class CollecionPinsApi extends BaseHttpClient {
  public getMyPins = async (): APIResponse<string[]> => {
    return this.get("api/collections/pins/my");
  };

  public pinCollection = async (collectionId: string): APIResponse<null> => {
    return this.put(`api/collections/pins/${collectionId}`);
  };

  public unpinCollection = async (collectionId: string): APIResponse<null> => {
    return this.delete(`api/collections/pins/${collectionId}`);
  };
}

export const collecionPinsApi = new CollecionPinsApi();
