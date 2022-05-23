import style from "@styles/publicDien/css/style.module.scss";
import { useRouter } from "next/router";

import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import { dateToJsonLocal, firestore } from "@lib/firebase";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  doc,
  getDocs,
  getDoc,
  collectionGroup,
  query,
  limit,
} from "firebase/firestore";
import { getCrumbList } from "@lib/commonFunctions";
import React from "react";
import Link from "next/link";
import Comment from "@components/Community/Blog/comment";

export async function getStaticProps({ params }) {
  const { gameSlug, uid, blogId } = params;

  const blogRef = doc(
    firestore,
    "games",
    gameSlug,
    "community",
    uid,
    "blogs",
    blogId
  );
  const blog = dateToJsonLocal(await getDoc(blogRef));
  const { gameTitle, username, title } = blog;
  const path = blogRef.path; //? hydrate data bellow

  const crumbList = [
    { href: `/community`, title: "community" },
    { href: `/community/${gameSlug}`, title: gameTitle },
    { href: `/community/${gameSlug}/${uid}`, title: username },
    { href: `/community/${gameSlug}/${uid}/${blogId}`, title: title },
  ];

  return {
    props: { blog, path, crumbList },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  const q = query(collectionGroup(firestore, "blogs"), limit(20));
  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((doc) => {
    const { gameSlug, uid, blogId } = doc.data();
    return {
      params: { gameSlug, uid, blogId },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const index = ({ blog, path, crumbList }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <section className={style.community__detail}>
        <div className={style.community__detail__main}>
          <div className={style.bread_crumb}>
            <ul>
              {crumbList.map((crumb, index) => {
                if (index == crumbList.length - 1) {
                  return (
                    <React.Fragment key={crumb.title}>
                      <li>{crumb.title}</li>
                    </React.Fragment>
                  );
                } else {
                  return (
                    <React.Fragment key={crumb.title}>
                      <li>
                        <Link href={crumb.href}>
                          <a>{crumb.title}</a>
                        </Link>
                      </li>
                    </React.Fragment>
                  );
                }
              })}
            </ul>
          </div>
          <div className={style.content}>
            <div className={style.comment__user_post}>
              <div className={style.user_img}>
                <img
                  src="/imageDien/img/45e22dc9b97aa2370e6246cdd8f1f8d66cad947d.jpg"
                  alt=""
                />
              </div>
              <div className={style.user_name}>
                <a href="#">{blog.username}</a>{" "}
              </div>
              <div className={style.time_post}>
                <br />
                {blog.createdAt}
              </div>
            </div>
            <div className={style.detail__title}>
              <h1>{blog.title}</h1>
            </div>
            <div className={style.detail__img}>
              <img src="/imageDien/img/item.jpg" alt="" />
            </div>
            <div className={style.detail__content}>
              <p>{blog.content}</p>
            </div>
            <div className={style.detail__rate}>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <p>{blog.karma} lượt thích</p>
            </div>
          </div>
          <div className={style.comment}>
            <div className={style.comment__list}>
              <h1>Comment</h1>
              <Comment blog={blog} />
              <div className={style.comment__list__pagination}>
                <a href="#">Hiển thị thêm bình luân / Phân trang</a>
              </div>
            </div>
            <div className={style.comment__box}>
              <div className={style.user_img}>
                <img
                  src="/imageDien/img/45e22dc9b97aa2370e6246cdd8f1f8d66cad947d.jpg"
                  alt=""
                />
              </div>
              <div className={style.user_comment}>
                <form>
                  <label htmlFor="name">Comment here</label>
                  <br />
                  <input type="text" name="name" id="name" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ThemeProvider>
  );
};

export default index;
