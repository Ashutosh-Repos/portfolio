export interface ExternalProvider<TRaw, TNormalized> {
  readonly providerKey: string;
  readonly displayName: string;
  fetchRawData(accountIdentifier: string): Promise<TRaw>;
  normalize(raw: TRaw): TNormalized;
}
