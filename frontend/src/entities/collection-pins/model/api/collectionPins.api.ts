import { BaseHttpClient } from "@/shared/lib/http/axios";
import { APIResponse } from "@/shared/types/api";

interface CollectionResponse {
  collectionIds: string[]
}

class CollecionPinsApi extends BaseHttpClient {
  public getMyPins = async (): APIResponse<CollectionResponse> => {
    return this.get("api/collections/pins/my");
  };

  public pinCollection = async (collectionId: string): APIResponse<CollectionResponse> => {
    return this.put(`api/collections/pins/${collectionId}`);
  };

  public unpinCollection = async (collectionId: string): APIResponse<CollectionResponse> => {
    return this.delete(`api/collections/pins/${collectionId}`);
  };
}

export const collecionPinsApi = new CollecionPinsApi();
