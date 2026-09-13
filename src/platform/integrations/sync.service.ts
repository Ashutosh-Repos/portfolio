import { db, schema } from '../db';
import { eq } from 'drizzle-orm';
import { githubAdapter } from './github/github.adapter';
import { leetCodeAdapter } from './leetcode/leetcode.adapter';

export class SyncService {
  async syncGitHub(username = 'Ashutosh-Repos'): Promise<{ success: boolean; reposCount: number; error?: string }> {
    const providerKey = 'github';
    const now = Date.now();

    try {
      await this.setProviderStatus(providerKey, 'running');

      const raw = await githubAdapter.fetchRawData(username);
      const normalized = githubAdapter.normalize(raw);

      // Upsert overview activity snapshot
      await db
        .insert(schema.externalActivitySnapshot)
        .values({
          id: 'github_overview',
          provider: 'github',
          metricType: 'overview',
          payloadJson: JSON.stringify(normalized),
          syncedAt: now,
        })
        .onConflictDoUpdate({
          target: schema.externalActivitySnapshot.id,
          set: {
            payloadJson: JSON.stringify(normalized),
            syncedAt: now,
          },
        });

      // Upsert individual repo snapshots
      for (const repo of normalized.repositories) {
        await db
          .insert(schema.githubRepoSnapshot)
          .values({
            id: repo.id,
            name: repo.name,
            fullName: repo.fullName,
            description: repo.description,
            stars: repo.stars,
            forks: repo.forks,
            openIssues: repo.openIssues,
            primaryLanguage: repo.primaryLanguage,
            languagesJson: JSON.stringify(repo.languages),
            latestCommitSha: repo.latestCommitSha,
            latestCommitAt: repo.latestCommitAt,
            isPinned: repo.isPinned,
            repoUrl: repo.repoUrl,
            homepageUrl: repo.homepageUrl,
            topicsJson: JSON.stringify(repo.topics),
            syncedAt: now,
          })
          .onConflictDoUpdate({
            target: schema.githubRepoSnapshot.id,
            set: {
              stars: repo.stars,
              forks: repo.forks,
              openIssues: repo.openIssues,
              primaryLanguage: repo.primaryLanguage,
              languagesJson: JSON.stringify(repo.languages),
              latestCommitAt: repo.latestCommitAt,
              repoUrl: repo.repoUrl,
              topicsJson: JSON.stringify(repo.topics),
              syncedAt: now,
            },
          });
      }

      await this.setProviderStatus(providerKey, 'success', null, now);
      return { success: true, reposCount: normalized.repositories.length };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await this.setProviderStatus(providerKey, 'error', errorMsg);
      return { success: false, reposCount: 0, error: errorMsg };
    }
  }

  async syncLeetCode(username = 'ashutosh0406'): Promise<{ success: boolean; error?: string }> {
    const providerKey = 'leetcode';
    const now = Date.now();

    try {
      await this.setProviderStatus(providerKey, 'running');

      const raw = await leetCodeAdapter.fetchRawData(username);
      const normalized = leetCodeAdapter.normalize(raw);

      await db
        .insert(schema.externalActivitySnapshot)
        .values({
          id: 'leetcode_overview',
          provider: 'leetcode',
          metricType: 'overview',
          payloadJson: JSON.stringify(normalized),
          syncedAt: now,
        })
        .onConflictDoUpdate({
          target: schema.externalActivitySnapshot.id,
          set: {
            payloadJson: JSON.stringify(normalized),
            syncedAt: now,
          },
        });

      await this.setProviderStatus(providerKey, 'success', null, now);
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await this.setProviderStatus(providerKey, 'error', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  async syncAll(): Promise<{
    github: { success: boolean; reposCount?: number; error?: unknown };
    leetcode: { success: boolean; error?: unknown };
  }> {
    const [githubResult, leetCodeResult] = await Promise.allSettled([
      this.syncGitHub(),
      this.syncLeetCode(),
    ]);

    return {
      github: githubResult.status === 'fulfilled' ? githubResult.value : { success: false, error: githubResult.reason },
      leetcode: leetCodeResult.status === 'fulfilled' ? leetCodeResult.value : { success: false, error: leetCodeResult.reason },
    };
  }

  async getSnapshot<T>(id: string): Promise<{ data: T | null; syncedAt: number | null }> {
    const records = await db
      .select()
      .from(schema.externalActivitySnapshot)
      .where(eq(schema.externalActivitySnapshot.id, id))
      .limit(1);

    if (!records.length) {
      return { data: null, syncedAt: null };
    }

    try {
      return {
        data: JSON.parse(records[0].payloadJson) as T,
        syncedAt: records[0].syncedAt,
      };
    } catch {
      return { data: null, syncedAt: records[0].syncedAt };
    }
  }

  private async setProviderStatus(
    providerKey: string,
    status: 'idle' | 'running' | 'success' | 'error',
    lastError: string | null = null,
    lastSyncedAt?: number
  ): Promise<void> {
    const updateValues: {
      syncStatus: 'idle' | 'running' | 'success' | 'error';
      lastError?: string | null;
      lastSyncedAt?: number;
    } = { syncStatus: status };
    if (lastError !== null) updateValues.lastError = lastError;
    if (lastSyncedAt) updateValues.lastSyncedAt = lastSyncedAt;

    await db
      .insert(schema.integrationProvider)
      .values({
        providerKey,
        displayName: providerKey === 'github' ? 'GitHub' : 'LeetCode',
        accountIdentifier: providerKey === 'github' ? 'Ashutosh-Repos' : 'ashutosh0406',
        syncStatus: status,
        lastError,
        lastSyncedAt: lastSyncedAt || null,
      })
      .onConflictDoUpdate({
        target: schema.integrationProvider.providerKey,
        set: updateValues,
      });
  }
}

export const syncService = new SyncService();
