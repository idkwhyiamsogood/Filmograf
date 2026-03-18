import { BaseHttpClient } from "@/shared/lib";
import { ApiResponse } from "@/shared/types/api";

class CollecionPinsApi extends BaseHttpClient {
  public getMyPins = async (): ApiResponse<number[]> => {
    return this.get("api/collections/pins/my");
  };

  public pinCollection = async (collectionId: string): ApiResponse<null> => {
    return this.put(`api/collections/pins/${collectionId}`);
  };

  public unpinCollection = async (collectionId: string): ApiResponse<null> => {
    return this.delete(`api/collections/pins/${collectionId}`);
  };
}

export const collecionPinsApi = new CollecionPinsApi();
