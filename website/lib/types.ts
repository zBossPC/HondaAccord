export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
}

export interface ReleaseInfo {
  tag: string;
  name: string;
  publishedAt: string;
  body: string;
  assets: ReleaseAsset[];
  pageUrl: string;
}
