/*
  Warnings:

  - Made the column `user` on table `Code` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user` on table `Tag` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user` on table `Print` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Code" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL DEFAULT '',
    "user" TEXT NOT NULL,
    CONSTRAINT "Code_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Code" ("code", "id", "user") SELECT "code", "id", "user" FROM "Code";
DROP TABLE "Code";
ALTER TABLE "new_Code" RENAME TO "Code";
CREATE UNIQUE INDEX "Code_code_key" ON "Code"("code");
CREATE UNIQUE INDEX "Code_user_key" ON "Code"("user");
CREATE TABLE "new_Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL DEFAULT '',
    "user" TEXT NOT NULL,
    CONSTRAINT "Tag_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("code", "id", "user") SELECT "code", "id", "user" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE UNIQUE INDEX "Tag_code_key" ON "Tag"("code");
CREATE UNIQUE INDEX "Tag_user_key" ON "Tag"("user");
CREATE TABLE "new_Print" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL DEFAULT '',
    "user" TEXT NOT NULL,
    CONSTRAINT "Print_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Print" ("code", "id", "user") SELECT "code", "id", "user" FROM "Print";
DROP TABLE "Print";
ALTER TABLE "new_Print" RENAME TO "Print";
CREATE UNIQUE INDEX "Print_code_key" ON "Print"("code");
CREATE INDEX "Print_user_idx" ON "Print"("user");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
