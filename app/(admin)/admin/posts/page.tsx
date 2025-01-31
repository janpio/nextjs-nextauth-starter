import {prisma} from "@/db";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log("session", session);
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    where: {
      author: {
        id: session?.user?.id,
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="myTable cols3">
        <div>
          <b>Title</b>
        </div>
        <div>
          <b>Published</b>
        </div>
        <div>
          <b>Author</b>
        </div>
        {posts.map((post) => (
          <div key={post.id} className="contents">
            <div>{post.title}</div>
            <div>{post.published ? "Yes" : "No"}</div>
            <div>{post.author?.name}</div>
          </div>
        ))}
      </div>
      <Link href="/admin/posts/create" className="btn">
        Create New Post
      </Link>
    </div>
  );
}
