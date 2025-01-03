/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:db-schema` to regenerate this file.
 */

import {
  pgTable,
  index,
  uniqueIndex,
  foreignKey,
  serial,
  varchar,
  timestamp,
  integer,
  jsonb,
  numeric,
  pgEnum,
} from "@payloadcms/db-postgres/drizzle/pg-core";
import { sql, relations } from "@payloadcms/db-postgres/drizzle";
export const enum__locales = pgEnum("enum__locales", ["en", "nl"]);
export const enum_users_roles = pgEnum("enum_users_roles", [
  "admin",
  "editor",
  "volunteer",
]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    roles: enum_users_roles("roles"),
    preferredName: varchar("preferred_name").notNull(),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
    email: varchar("email").notNull(),
    resetPasswordToken: varchar("reset_password_token"),
    resetPasswordExpiration: timestamp("reset_password_expiration", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    }),
    salt: varchar("salt"),
    hash: varchar("hash"),
  },
  (columns) => ({
    users_updated_at_idx: index("users_updated_at_idx").on(columns.updatedAt),
    users_created_at_idx: index("users_created_at_idx").on(columns.createdAt),
    users_email_idx: uniqueIndex("users_email_idx").on(columns.email),
  }),
);

export const event_templates_sections_roles_signups = pgTable(
  "event_templates_sections_roles_signups",
  {
    _order: integer("_order").notNull(),
    _parentID: varchar("_parent_id").notNull(),
    id: varchar("id").primaryKey(),
    user: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "set null",
      }),
  },
  (columns) => ({
    _orderIdx: index("event_templates_sections_roles_signups_order_idx").on(
      columns._order,
    ),
    _parentIDIdx: index(
      "event_templates_sections_roles_signups_parent_id_idx",
    ).on(columns._parentID),
    event_templates_sections_roles_signups_user_idx: index(
      "event_templates_sections_roles_signups_user_idx",
    ).on(columns.user),
    _parentIDFk: foreignKey({
      columns: [columns["_parentID"]],
      foreignColumns: [event_templates_sections_roles.id],
      name: "event_templates_sections_roles_signups_parent_id_fk",
    }).onDelete("cascade"),
  }),
);

export const event_templates_sections_roles = pgTable(
  "event_templates_sections_roles",
  {
    _order: integer("_order").notNull(),
    _parentID: varchar("_parent_id").notNull(),
    id: varchar("id").primaryKey(),
    title: varchar("title").notNull(),
    description: jsonb("description"),
    maxSignups: numeric("max_signups").notNull().default("1"),
  },
  (columns) => ({
    _orderIdx: index("event_templates_sections_roles_order_idx").on(
      columns._order,
    ),
    _parentIDIdx: index("event_templates_sections_roles_parent_id_idx").on(
      columns._parentID,
    ),
    _parentIDFk: foreignKey({
      columns: [columns["_parentID"]],
      foreignColumns: [event_templates_sections.id],
      name: "event_templates_sections_roles_parent_id_fk",
    }).onDelete("cascade"),
  }),
);

export const event_templates_sections = pgTable(
  "event_templates_sections",
  {
    _order: integer("_order").notNull(),
    _parentID: integer("_parent_id").notNull(),
    id: varchar("id").primaryKey(),
    title: varchar("title").notNull(),
    description: jsonb("description"),
  },
  (columns) => ({
    _orderIdx: index("event_templates_sections_order_idx").on(columns._order),
    _parentIDIdx: index("event_templates_sections_parent_id_idx").on(
      columns._parentID,
    ),
    _parentIDFk: foreignKey({
      columns: [columns["_parentID"]],
      foreignColumns: [event_templates.id],
      name: "event_templates_sections_parent_id_fk",
    }).onDelete("cascade"),
  }),
);

export const event_templates_roles_signups = pgTable(
  "event_templates_roles_signups",
  {
    _order: integer("_order").notNull(),
    _parentID: varchar("_parent_id").notNull(),
    id: varchar("id").primaryKey(),
    user: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "set null",
      }),
  },
  (columns) => ({
    _orderIdx: index("event_templates_roles_signups_order_idx").on(
      columns._order,
    ),
    _parentIDIdx: index("event_templates_roles_signups_parent_id_idx").on(
      columns._parentID,
    ),
    event_templates_roles_signups_user_idx: index(
      "event_templates_roles_signups_user_idx",
    ).on(columns.user),
    _parentIDFk: foreignKey({
      columns: [columns["_parentID"]],
      foreignColumns: [event_templates_roles.id],
      name: "event_templates_roles_signups_parent_id_fk",
    }).onDelete("cascade"),
  }),
);

export const event_templates_roles = pgTable(
  "event_templates_roles",
  {
    _order: integer("_order").notNull(),
    _parentID: integer("_parent_id").notNull(),
    id: varchar("id").primaryKey(),
    title: varchar("title").notNull(),
    description: jsonb("description"),
    maxSignups: numeric("max_signups").notNull().default("1"),
  },
  (columns) => ({
    _orderIdx: index("event_templates_roles_order_idx").on(columns._order),
    _parentIDIdx: index("event_templates_roles_parent_id_idx").on(
      columns._parentID,
    ),
    _parentIDFk: foreignKey({
      columns: [columns["_parentID"]],
      foreignColumns: [event_templates.id],
      name: "event_templates_roles_parent_id_fk",
    }).onDelete("cascade"),
  }),
);

export const event_templates = pgTable(
  "event_templates",
  {
    id: serial("id").primaryKey(),
    template_title: varchar("template_title").notNull(),
    event_title: varchar("event_title").notNull(),
    start_time: timestamp("start_time", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    }).notNull(),
    end_time: timestamp("end_time", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    }).notNull(),
    description: jsonb("description"),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    event_templates_updated_at_idx: index("event_templates_updated_at_idx").on(
      columns.updatedAt,
    ),
    event_templates_created_at_idx: index("event_templates_created_at_idx").on(
      columns.createdAt,
    ),
  }),
);

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    title: varchar("title").notNull(),
    start_date: timestamp("start_date", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    }).notNull(),
    end_date: timestamp("end_date", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    }).notNull(),
    description: jsonb("description"),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    events_updated_at_idx: index("events_updated_at_idx").on(columns.updatedAt),
    events_created_at_idx: index("events_created_at_idx").on(columns.createdAt),
  }),
);

export const sections = pgTable(
  "sections",
  {
    id: serial("id").primaryKey(),
    event: integer("event_id")
      .notNull()
      .references(() => events.id, {
        onDelete: "set null",
      }),
    title: varchar("title").notNull(),
    description: jsonb("description"),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    sections_event_idx: index("sections_event_idx").on(columns.event),
    sections_updated_at_idx: index("sections_updated_at_idx").on(
      columns.updatedAt,
    ),
    sections_created_at_idx: index("sections_created_at_idx").on(
      columns.createdAt,
    ),
  }),
);

export const roles = pgTable(
  "roles",
  {
    id: serial("id").primaryKey(),
    event: integer("event_id").references(() => events.id, {
      onDelete: "set null",
    }),
    section: integer("section_id").references(() => sections.id, {
      onDelete: "set null",
    }),
    title: varchar("title").notNull(),
    description: jsonb("description"),
    maxSignups: numeric("max_signups").notNull().default("1"),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    roles_event_idx: index("roles_event_idx").on(columns.event),
    roles_section_idx: index("roles_section_idx").on(columns.section),
    roles_updated_at_idx: index("roles_updated_at_idx").on(columns.updatedAt),
    roles_created_at_idx: index("roles_created_at_idx").on(columns.createdAt),
  }),
);

export const signups = pgTable(
  "signups",
  {
    id: serial("id").primaryKey(),
    event: integer("event_id").references(() => events.id, {
      onDelete: "set null",
    }),
    role: integer("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "set null",
      }),
    user: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "set null",
      }),
    title: varchar("title"),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    signups_event_idx: index("signups_event_idx").on(columns.event),
    signups_role_idx: index("signups_role_idx").on(columns.role),
    signups_user_idx: index("signups_user_idx").on(columns.user),
    signups_updated_at_idx: index("signups_updated_at_idx").on(
      columns.updatedAt,
    ),
    signups_created_at_idx: index("signups_created_at_idx").on(
      columns.createdAt,
    ),
  }),
);

export const payload_locked_documents = pgTable(
  "payload_locked_documents",
  {
    id: serial("id").primaryKey(),
    globalSlug: varchar("global_slug"),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    payload_locked_documents_global_slug_idx: index(
      "payload_locked_documents_global_slug_idx",
    ).on(columns.globalSlug),
    payload_locked_documents_updated_at_idx: index(
      "payload_locked_documents_updated_at_idx",
    ).on(columns.updatedAt),
    payload_locked_documents_created_at_idx: index(
      "payload_locked_documents_created_at_idx",
    ).on(columns.createdAt),
  }),
);

export const payload_locked_documents_rels = pgTable(
  "payload_locked_documents_rels",
  {
    id: serial("id").primaryKey(),
    order: integer("order"),
    parent: integer("parent_id").notNull(),
    path: varchar("path").notNull(),
    usersID: integer("users_id"),
    "event-templatesID": integer("event_templates_id"),
    eventsID: integer("events_id"),
    sectionsID: integer("sections_id"),
    rolesID: integer("roles_id"),
    signupsID: integer("signups_id"),
  },
  (columns) => ({
    order: index("payload_locked_documents_rels_order_idx").on(columns.order),
    parentIdx: index("payload_locked_documents_rels_parent_idx").on(
      columns.parent,
    ),
    pathIdx: index("payload_locked_documents_rels_path_idx").on(columns.path),
    payload_locked_documents_rels_users_id_idx: index(
      "payload_locked_documents_rels_users_id_idx",
    ).on(columns.usersID),
    payload_locked_documents_rels_event_templates_id_idx: index(
      "payload_locked_documents_rels_event_templates_id_idx",
    ).on(columns["event-templatesID"]),
    payload_locked_documents_rels_events_id_idx: index(
      "payload_locked_documents_rels_events_id_idx",
    ).on(columns.eventsID),
    payload_locked_documents_rels_sections_id_idx: index(
      "payload_locked_documents_rels_sections_id_idx",
    ).on(columns.sectionsID),
    payload_locked_documents_rels_roles_id_idx: index(
      "payload_locked_documents_rels_roles_id_idx",
    ).on(columns.rolesID),
    payload_locked_documents_rels_signups_id_idx: index(
      "payload_locked_documents_rels_signups_id_idx",
    ).on(columns.signupsID),
    parentFk: foreignKey({
      columns: [columns["parent"]],
      foreignColumns: [payload_locked_documents.id],
      name: "payload_locked_documents_rels_parent_fk",
    }).onDelete("cascade"),
    usersIdFk: foreignKey({
      columns: [columns["usersID"]],
      foreignColumns: [users.id],
      name: "payload_locked_documents_rels_users_fk",
    }).onDelete("cascade"),
    "event-templatesIdFk": foreignKey({
      columns: [columns["event-templatesID"]],
      foreignColumns: [event_templates.id],
      name: "payload_locked_documents_rels_event_templates_fk",
    }).onDelete("cascade"),
    eventsIdFk: foreignKey({
      columns: [columns["eventsID"]],
      foreignColumns: [events.id],
      name: "payload_locked_documents_rels_events_fk",
    }).onDelete("cascade"),
    sectionsIdFk: foreignKey({
      columns: [columns["sectionsID"]],
      foreignColumns: [sections.id],
      name: "payload_locked_documents_rels_sections_fk",
    }).onDelete("cascade"),
    rolesIdFk: foreignKey({
      columns: [columns["rolesID"]],
      foreignColumns: [roles.id],
      name: "payload_locked_documents_rels_roles_fk",
    }).onDelete("cascade"),
    signupsIdFk: foreignKey({
      columns: [columns["signupsID"]],
      foreignColumns: [signups.id],
      name: "payload_locked_documents_rels_signups_fk",
    }).onDelete("cascade"),
  }),
);

export const payload_preferences = pgTable(
  "payload_preferences",
  {
    id: serial("id").primaryKey(),
    key: varchar("key"),
    value: jsonb("value"),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    payload_preferences_key_idx: index("payload_preferences_key_idx").on(
      columns.key,
    ),
    payload_preferences_updated_at_idx: index(
      "payload_preferences_updated_at_idx",
    ).on(columns.updatedAt),
    payload_preferences_created_at_idx: index(
      "payload_preferences_created_at_idx",
    ).on(columns.createdAt),
  }),
);

export const payload_preferences_rels = pgTable(
  "payload_preferences_rels",
  {
    id: serial("id").primaryKey(),
    order: integer("order"),
    parent: integer("parent_id").notNull(),
    path: varchar("path").notNull(),
    usersID: integer("users_id"),
  },
  (columns) => ({
    order: index("payload_preferences_rels_order_idx").on(columns.order),
    parentIdx: index("payload_preferences_rels_parent_idx").on(columns.parent),
    pathIdx: index("payload_preferences_rels_path_idx").on(columns.path),
    payload_preferences_rels_users_id_idx: index(
      "payload_preferences_rels_users_id_idx",
    ).on(columns.usersID),
    parentFk: foreignKey({
      columns: [columns["parent"]],
      foreignColumns: [payload_preferences.id],
      name: "payload_preferences_rels_parent_fk",
    }).onDelete("cascade"),
    usersIdFk: foreignKey({
      columns: [columns["usersID"]],
      foreignColumns: [users.id],
      name: "payload_preferences_rels_users_fk",
    }).onDelete("cascade"),
  }),
);

export const payload_migrations = pgTable(
  "payload_migrations",
  {
    id: serial("id").primaryKey(),
    name: varchar("name"),
    batch: numeric("batch"),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
      precision: 3,
    })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    payload_migrations_updated_at_idx: index(
      "payload_migrations_updated_at_idx",
    ).on(columns.updatedAt),
    payload_migrations_created_at_idx: index(
      "payload_migrations_created_at_idx",
    ).on(columns.createdAt),
  }),
);

export const relations_users = relations(users, () => ({}));
export const relations_event_templates_sections_roles_signups = relations(
  event_templates_sections_roles_signups,
  ({ one }) => ({
    _parentID: one(event_templates_sections_roles, {
      fields: [event_templates_sections_roles_signups._parentID],
      references: [event_templates_sections_roles.id],
      relationName: "signups",
    }),
    user: one(users, {
      fields: [event_templates_sections_roles_signups.user],
      references: [users.id],
      relationName: "user",
    }),
  }),
);
export const relations_event_templates_sections_roles = relations(
  event_templates_sections_roles,
  ({ one, many }) => ({
    _parentID: one(event_templates_sections, {
      fields: [event_templates_sections_roles._parentID],
      references: [event_templates_sections.id],
      relationName: "roles",
    }),
    signups: many(event_templates_sections_roles_signups, {
      relationName: "signups",
    }),
  }),
);
export const relations_event_templates_sections = relations(
  event_templates_sections,
  ({ one, many }) => ({
    _parentID: one(event_templates, {
      fields: [event_templates_sections._parentID],
      references: [event_templates.id],
      relationName: "sections",
    }),
    roles: many(event_templates_sections_roles, {
      relationName: "roles",
    }),
  }),
);
export const relations_event_templates_roles_signups = relations(
  event_templates_roles_signups,
  ({ one }) => ({
    _parentID: one(event_templates_roles, {
      fields: [event_templates_roles_signups._parentID],
      references: [event_templates_roles.id],
      relationName: "signups",
    }),
    user: one(users, {
      fields: [event_templates_roles_signups.user],
      references: [users.id],
      relationName: "user",
    }),
  }),
);
export const relations_event_templates_roles = relations(
  event_templates_roles,
  ({ one, many }) => ({
    _parentID: one(event_templates, {
      fields: [event_templates_roles._parentID],
      references: [event_templates.id],
      relationName: "roles",
    }),
    signups: many(event_templates_roles_signups, {
      relationName: "signups",
    }),
  }),
);
export const relations_event_templates = relations(
  event_templates,
  ({ many }) => ({
    sections: many(event_templates_sections, {
      relationName: "sections",
    }),
    roles: many(event_templates_roles, {
      relationName: "roles",
    }),
  }),
);
export const relations_events = relations(events, () => ({}));
export const relations_sections = relations(sections, ({ one }) => ({
  event: one(events, {
    fields: [sections.event],
    references: [events.id],
    relationName: "event",
  }),
}));
export const relations_roles = relations(roles, ({ one }) => ({
  event: one(events, {
    fields: [roles.event],
    references: [events.id],
    relationName: "event",
  }),
  section: one(sections, {
    fields: [roles.section],
    references: [sections.id],
    relationName: "section",
  }),
}));
export const relations_signups = relations(signups, ({ one }) => ({
  event: one(events, {
    fields: [signups.event],
    references: [events.id],
    relationName: "event",
  }),
  role: one(roles, {
    fields: [signups.role],
    references: [roles.id],
    relationName: "role",
  }),
  user: one(users, {
    fields: [signups.user],
    references: [users.id],
    relationName: "user",
  }),
}));
export const relations_payload_locked_documents_rels = relations(
  payload_locked_documents_rels,
  ({ one }) => ({
    parent: one(payload_locked_documents, {
      fields: [payload_locked_documents_rels.parent],
      references: [payload_locked_documents.id],
      relationName: "_rels",
    }),
    usersID: one(users, {
      fields: [payload_locked_documents_rels.usersID],
      references: [users.id],
      relationName: "users",
    }),
    "event-templatesID": one(event_templates, {
      fields: [payload_locked_documents_rels["event-templatesID"]],
      references: [event_templates.id],
      relationName: "event-templates",
    }),
    eventsID: one(events, {
      fields: [payload_locked_documents_rels.eventsID],
      references: [events.id],
      relationName: "events",
    }),
    sectionsID: one(sections, {
      fields: [payload_locked_documents_rels.sectionsID],
      references: [sections.id],
      relationName: "sections",
    }),
    rolesID: one(roles, {
      fields: [payload_locked_documents_rels.rolesID],
      references: [roles.id],
      relationName: "roles",
    }),
    signupsID: one(signups, {
      fields: [payload_locked_documents_rels.signupsID],
      references: [signups.id],
      relationName: "signups",
    }),
  }),
);
export const relations_payload_locked_documents = relations(
  payload_locked_documents,
  ({ many }) => ({
    _rels: many(payload_locked_documents_rels, {
      relationName: "_rels",
    }),
  }),
);
export const relations_payload_preferences_rels = relations(
  payload_preferences_rels,
  ({ one }) => ({
    parent: one(payload_preferences, {
      fields: [payload_preferences_rels.parent],
      references: [payload_preferences.id],
      relationName: "_rels",
    }),
    usersID: one(users, {
      fields: [payload_preferences_rels.usersID],
      references: [users.id],
      relationName: "users",
    }),
  }),
);
export const relations_payload_preferences = relations(
  payload_preferences,
  ({ many }) => ({
    _rels: many(payload_preferences_rels, {
      relationName: "_rels",
    }),
  }),
);
export const relations_payload_migrations = relations(
  payload_migrations,
  () => ({}),
);

type DatabaseSchema = {
  enum__locales: typeof enum__locales;
  enum_users_roles: typeof enum_users_roles;
  users: typeof users;
  event_templates_sections_roles_signups: typeof event_templates_sections_roles_signups;
  event_templates_sections_roles: typeof event_templates_sections_roles;
  event_templates_sections: typeof event_templates_sections;
  event_templates_roles_signups: typeof event_templates_roles_signups;
  event_templates_roles: typeof event_templates_roles;
  event_templates: typeof event_templates;
  events: typeof events;
  sections: typeof sections;
  roles: typeof roles;
  signups: typeof signups;
  payload_locked_documents: typeof payload_locked_documents;
  payload_locked_documents_rels: typeof payload_locked_documents_rels;
  payload_preferences: typeof payload_preferences;
  payload_preferences_rels: typeof payload_preferences_rels;
  payload_migrations: typeof payload_migrations;
  relations_users: typeof relations_users;
  relations_event_templates_sections_roles_signups: typeof relations_event_templates_sections_roles_signups;
  relations_event_templates_sections_roles: typeof relations_event_templates_sections_roles;
  relations_event_templates_sections: typeof relations_event_templates_sections;
  relations_event_templates_roles_signups: typeof relations_event_templates_roles_signups;
  relations_event_templates_roles: typeof relations_event_templates_roles;
  relations_event_templates: typeof relations_event_templates;
  relations_events: typeof relations_events;
  relations_sections: typeof relations_sections;
  relations_roles: typeof relations_roles;
  relations_signups: typeof relations_signups;
  relations_payload_locked_documents_rels: typeof relations_payload_locked_documents_rels;
  relations_payload_locked_documents: typeof relations_payload_locked_documents;
  relations_payload_preferences_rels: typeof relations_payload_preferences_rels;
  relations_payload_preferences: typeof relations_payload_preferences;
  relations_payload_migrations: typeof relations_payload_migrations;
};

declare module "@payloadcms/db-postgres/types" {
  export interface GeneratedDatabaseSchema {
    schema: DatabaseSchema;
  }
}
