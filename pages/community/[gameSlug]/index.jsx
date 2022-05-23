import style from "@styles/publicDien/css/slug.module.scss";
import { UserContext } from "@lib/globalContext";
import { useContext, useState } from "react";
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { dateToJsonLocal, firestore } from "@lib/firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

function App() {
  const { user, username } = useContext(UserContext);
  const router = useRouter();
  const { gameSlug } = router.query;

  const [blogController, setBlogController] = useState({
    title: "",
    content: "",
  });
  const setNewBlog = async (e) => {
    e.preventDefault();

    if (
      Object.values(blogController).every(
        (data) => data !== null && data.length >= 1
      )
    ) {
      // const gameSlug = "furry-fury-smash-roll";
      const userBlogRef = collection(
        firestore,
        "games",
        gameSlug,
        "community",
        user.uid,
        "blogs"
      );
      const generatedBlogId = doc(userBlogRef).id;
      await setDoc(
        doc(
          firestore,
          "games",
          gameSlug,
          "community",
          user.uid,
          "blogs",
          generatedBlogId
        ),
        {
          ...blogController,
          blogId: generatedBlogId,
          gameSlug: gameSlug,
          gameTitle: gameSlug,
          images: [],
          karma: 0,
          uid: user.uid,
          username: username,
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      setBlogController({ title: "", content: "" });
      toast.success("Blog posted successfully!");
    } else toast.error("Blog need a title and content!");
  };
  return (
    <div onClick={() => console.log(gameSlug)} className={style.container}>
      <section className={style.community}>
        <header>
          <div className={style.community__header__title}>
            <h1>Game Name</h1>
          </div>
        </header>
        <div className={style.community__main}>
          <div>
            {user && username && (
              <div className={style.form__post}>
                Start a new post
                <div className={style.container}>
                  <form onSubmit={setNewBlog}>
                    <div className={style.row}>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter Title.."
                        value={blogController?.title}
                        onChange={(e) =>
                          setBlogController({
                            ...blogController,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className={style.row}>
                      <textarea
                        id="content"
                        name="content"
                        placeholder="Say something.."
                        value={blogController?.content}
                        onChange={(e) =>
                          setBlogController({
                            ...blogController,
                            content: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={style.row}>
                      <input type="file" />
                    </div>
                    <div className={style.row}>
                      <input type="submit" value="Submit" />
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
