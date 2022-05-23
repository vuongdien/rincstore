import style from "@styles/publicDien/css/style.module.scss";

const Comment = ({ blog }) => {
  return (
    <div className={style.comment__list__item}>
      <div className={style.user_img}>
        <img src={blog.photoURL || `/icons/hacker.png`} alt="" />
      </div>
      <div className={style.user_name}>
        <a href="#">Username</a>{" "}
      </div>
      <br />
      <div className={style.time_comment}>
        <a href="#">4 giờ trước</a>{" "}
      </div>
      <br />
      <div className={style.user_comment}>
        <p>
          {" "}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
          perferendis molestiae non nemo doloribus. Doloremque, nihil! At ea
          atque quidem!
        </p>
      </div>
    </div>
  );
};

export default Comment;
