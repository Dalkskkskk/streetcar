import { ApiPermissions } from "@shared/apiPermissions";
import { getRepository, Repository } from "typeorm";
import { ApiAuditLog } from "./ApiAuditLog";
import { AuditLogEventTypes } from "./apiAuditLogTypes";
import { BaseRepository } from "./BaseRepository";
import { ApiPermissionAssignment } from "./entities/ApiPermissionAssignment";
import { isStaff } from "../staff.js";
import { AllowedGuilds } from "./AllowedGuilds.js";

export enum ApiPermissionTypes {
  User = "USER",
  Role = "ROLE",
}

export class ApiPermissionAssignments extends BaseRepository {
  private apiPermissions: Repository<ApiPermissionAssignment>;
  private auditLogs: ApiAuditLog;

  constructor() {
    super();
    this.apiPermissions = getRepository(ApiPermissionAssignment);
    this.auditLogs = new ApiAuditLog();
  }
  

  private STAFF_PERMS = [
    ApiPermissions.ManageAccess,
    ApiPermissions.EditConfig,
    ApiPermissions.ReadConfig,
    ApiPermissions.ViewGuild,
    ApiPermissions.Owner,
  ];

  getByGuildId(guildId) {
    return this.apiPermissions.find({
      where: {
        guild_id: guildId,
      },
    });
  }

  async getByUserId(userId) {
    if (isStaff(userId)) {
      const allowedGuilds = new AllowedGuilds();
      const allGuilds = await allowedGuilds.getAll();
      const data: ApiPermissionAssignment[] = allGuilds.map((guild) => {
        return {
          guild_id: guild.id,
          type: ApiPermissionTypes.User,
          target_id: userId,
          expires_at: null,
          permissions: this.STAFF_PERMS,
          userInfo: {
            data: {
              username: "staff",
              discriminator: "0000",
              avatar: "",
            },
            updated_at: "",
            logins: [],
            permissionAssignments: [],
            id: userId,
          },
        };
      });
      return data;
    }

    return this.apiPermissions.find({
      where: {
        type: ApiPermissionTypes.User,
        target_id: userId,
      },
    });
  }

  getByGuildAndUserId(guildId, userId) {
     if (isStaff(userId)) {
      return new Promise((resolve, reject) => {
        resolve({
          guild_id: guildId,
          type: ApiPermissionTypes.User,
          target_id: userId,
          expires_at: null,
          permissions: this.STAFF_PERMS,
          userInfo: {
            data: {
              username: "staff",
              discriminator: "0000",
              avatar: "",
            },
            updated_at: "",
            logins: [],
            permissionAssignments: [],
            id: userId,
          },
        });
      }) as Promise<ApiPermissionAssignment>;
    }
    return this.apiPermissions.findOne({
      where: {
        guild_id: guildId,
        type: ApiPermissionTypes.User,
        target_id: userId,
      },
    });
  }

  addUser(guildId, userId, permissions: ApiPermissions[], expiresAt: string | null = null) {
    return this.apiPermissions.insert({
      guild_id: guildId,
      type: ApiPermissionTypes.User,
      target_id: userId,
      permissions,
      expires_at: expiresAt,
    });
  }

  removeUser(guildId, userId) {
    return this.apiPermissions.delete({ guild_id: guildId, type: ApiPermissionTypes.User, target_id: userId });
  }

  async updateUserPermissions(guildId: string, userId: string, permissions: ApiPermissions[]): Promise<void> {
    await this.apiPermissions.update(
      {
        guild_id: guildId,
        type: ApiPermissionTypes.User,
        target_id: userId,
      },
      {
        permissions,
      },
    );
  }

  async clearExpiredPermissions() {
    await this.apiPermissions
      .createQueryBuilder()
      .where("expires_at IS NOT NULL")
      .andWhere("expires_at <= NOW()")
      .delete()
      .execute();
  }

  async applyOwnerChange(guildId: string, newOwnerId: string) {
    const existingPermissions = await this.getByGuildId(guildId);
    let updatedOwner = false;
    for (const perm of existingPermissions) {
      let hasChanges = false;

      // Remove owner permission from anyone who currently has it
      if (perm.permissions.includes(ApiPermissions.Owner)) {
        perm.permissions.splice(perm.permissions.indexOf(ApiPermissions.Owner), 1);
        hasChanges = true;
      }

      // Add owner permission if we encounter the new owner
      if (perm.type === ApiPermissionTypes.User && perm.target_id === newOwnerId) {
        perm.permissions.push(ApiPermissions.Owner);
        updatedOwner = true;
        hasChanges = true;
      }

      if (hasChanges) {
        const criteria = {
          guild_id: perm.guild_id,
          type: perm.type,
          target_id: perm.target_id,
        };
        if (perm.permissions.length === 0) {
          // No remaining permissions -> remove entry
          this.auditLogs.addEntry(guildId, "0", AuditLogEventTypes.REMOVE_API_PERMISSION, {
            type: perm.type,
            target_id: perm.target_id,
          });
          await this.apiPermissions.delete(criteria);
        } else {
          this.auditLogs.addEntry(guildId, "0", AuditLogEventTypes.EDIT_API_PERMISSION, {
            type: perm.type,
            target_id: perm.target_id,
            permissions: perm.permissions,
            expires_at: perm.expires_at,
          });
          await this.apiPermissions.update(criteria, {
            permissions: perm.permissions,
          });
        }
      }
    }

    if (!updatedOwner) {
      this.auditLogs.addEntry(guildId, "0", AuditLogEventTypes.ADD_API_PERMISSION, {
        type: ApiPermissionTypes.User,
        target_id: newOwnerId,
        permissions: [ApiPermissions.Owner],
        expires_at: null,
      });
      await this.apiPermissions.insert({
        guild_id: guildId,
        type: ApiPermissionTypes.User,
        target_id: newOwnerId,
        permissions: [ApiPermissions.Owner],
      });
    }
  }
}
