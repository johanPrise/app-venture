import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        id: string,
    }

    interface Profile {
        login?: string,
        bio?: string | null,
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string,
    }
}
