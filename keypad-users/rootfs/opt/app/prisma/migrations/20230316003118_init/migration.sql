-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Print" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL DEFAULT '',
    "user" TEXT,
    CONSTRAINT "Print_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Code" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL DEFAULT '',
    "user" TEXT,
    CONSTRAINT "Code_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL DEFAULT '',
    "user" TEXT,
    CONSTRAINT "Tag_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Print_code_key" ON "Print"("code");

-- CreateIndex
CREATE INDEX "Print_user_idx" ON "Print"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Code_code_key" ON "Code"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Code_user_key" ON "Code"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_code_key" ON "Tag"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_user_key" ON "Tag"("user");
