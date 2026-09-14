import { db, schema } from '../db';
import { eq, notInArray, sql } from 'drizzle-orm';
import { githubAdapter } from './github/github.adapter';
import { leetCodeAdapter } from './leetcode/leetcode.adapter';

export class SyncService {
  async syncGitHub(
    username = 'Ashutosh-Repos',
  ): Promise<{ success: boolean; reposCount: number; error?: string }> {
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

      const validRepoIds = normalized.repositories.map((r) => r.id);

      // Clean out any stale repository snapshots not in GitHub
      if (validRepoIds.length > 0) {
        // Delete stale projects first to respect foreign key constraint
        const staleProjects = await db
          .select({
            id: schema.project.id,
            githubRepoId: schema.project.githubRepoId,
          })
          .from(schema.project)
          .where(notInArray(schema.project.githubRepoId, validRepoIds));

        for (const sp of staleProjects) {
          if (sp.githubRepoId) {
            await db.delete(schema.project).where(eq(schema.project.id, sp.id));
          }
        }

        await db
          .delete(schema.githubRepoSnapshot)
          .where(notInArray(schema.githubRepoSnapshot.id, validRepoIds));
      }

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
              name: repo.name,
              fullName: repo.fullName,
              description: repo.description,
              stars: repo.stars,
              forks: repo.forks,
              openIssues: repo.openIssues,
              primaryLanguage: repo.primaryLanguage,
              languagesJson: JSON.stringify(repo.languages),
              latestCommitAt: repo.latestCommitAt,
              isPinned: repo.isPinned,
              repoUrl: repo.repoUrl,
              homepageUrl: repo.homepageUrl,
              topicsJson: JSON.stringify(repo.topics),
              syncedAt: now,
            },
          });
      }

      // Pinned priority ordering
      const PINNED_ORDER: Record<string, number> = {
        Tessera: 1,
        Bunly: 2,
        Post: 3,
        'video-encoder': 4,
        'macbook-usb-tethering': 5,
        WeatherNow: 6,
      };

      // Synchronize project entities from authentic GitHub repositories
      const existingProjects = await db.select().from(schema.project);
      const projectByRepoId = new Map(
        existingProjects
          .filter((p) => p.githubRepoId)
          .map((p) => [p.githubRepoId as string, p]),
      );
      const projectBySlug = new Map(
        existingProjects.map((p) => [p.slug.toLowerCase(), p]),
      );

      for (let i = 0; i < normalized.repositories.length; i++) {
        const repo = normalized.repositories[i];
        const repoSlug = repo.name.toLowerCase();
        const existing =
          projectByRepoId.get(repo.id) || projectBySlug.get(repoSlug);
        const featuredPriority = PINNED_ORDER[repo.name] || null;

        if (existing) {
          await db
            .update(schema.project)
            .set({
              title: repo.name,
              featuredPriority,
              demoUrl: repo.homepageUrl || existing.demoUrl || repo.repoUrl,
              githubRepoId: repo.id,
              technologiesJson: JSON.stringify(
                repo.primaryLanguage
                  ? [repo.primaryLanguage, ...repo.topics]
                  : repo.topics,
              ),
              updatedAt: now,
            })
            .where(eq(schema.project.id, existing.id));
        } else {
          await db.insert(schema.project).values({
            id: `proj-${repoSlug}`,
            slug: repoSlug,
            title: repo.name,
            tagline: repo.description || `${repo.name} open-source project`,
            description:
              repo.description || `${repo.name} repository by Ashutosh.`,
            status: 'completed',
            featuredPriority,
            demoUrl: repo.homepageUrl || repo.repoUrl,
            packageUrl: null,
            githubRepoId: repo.id,
            technologiesJson: JSON.stringify(
              repo.primaryLanguage
                ? [repo.primaryLanguage, ...repo.topics]
                : repo.topics,
            ),
            architectureJson: JSON.stringify(['Open-Source System']),
            coverImageUrl: null,
            galleryId: null,
            sortOrder: featuredPriority ? featuredPriority : 10 + i,
            createdAt: repo.latestCommitAt || now,
            updatedAt: now,
          });
        }
      }

      await this.setProviderStatus(providerKey, 'success', null, now);
      return { success: true, reposCount: normalized.repositories.length };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await this.setProviderStatus(providerKey, 'error', errorMsg);
      return { success: false, reposCount: 0, error: errorMsg };
    }
  }

  async syncLeetCode(
    username = 'ashutosh0406',
  ): Promise<{ success: boolean; error?: string }> {
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
      github:
        githubResult.status === 'fulfilled'
          ? githubResult.value
          : { success: false, error: githubResult.reason },
      leetcode:
        leetCodeResult.status === 'fulfilled'
          ? leetCodeResult.value
          : { success: false, error: leetCodeResult.reason },
    };
  }

  async getSnapshot<T>(
    id: string,
  ): Promise<{ data: T | null; syncedAt: number | null }> {
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
    lastSyncedAt?: number,
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
        accountIdentifier:
          providerKey === 'github' ? 'Ashutosh-Repos' : 'ashutosh0406',
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
