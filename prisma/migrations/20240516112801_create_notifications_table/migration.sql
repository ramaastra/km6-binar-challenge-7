-- AlterTable
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
