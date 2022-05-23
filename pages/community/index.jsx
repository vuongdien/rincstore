import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import style from "@styles/publicDien/css/style.module.scss";
import Slider from "react-slick";
import { dateToJsonLocal, firestore } from "@lib/firebase";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ReactPaginate from "react-paginate";
import { styled } from "@mui/material/styles";
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { ModeComment } from "@mui/icons-material";
import { margin } from "@mui/material/node_modules/@mui/system";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
export async function getServerSideProps() {
  //blogdesc
  //? HARD limit on the post
  const LIMIT = 4;
  const ref = collectionGroup(firestore, "blogs");
  const blogsDescQuery = query(ref, orderBy("createdAt", "desc"), limit(LIMIT));

  const blogsDesc = (await getDocs(blogsDescQuery)).docs.map((doc) =>
    dateToJsonLocal(doc)
  );
  return {
    props: { blogsDesc }, // will be passed to the page component as props
  };
}
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Index = ({ blogsDesc, gamesDesc }) => {
  {
  }
  //games
  const newsblog = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  var settingsfeatured = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const [blogs, setblogs] = useState(blogsDesc.slice(0, 50));
  const [pageNumber, setPageNumber] = useState(0);

  const blogsPerPage = 6;
  const pagesVisited = pageNumber * blogsPerPage;

  const displayblogs = blogs
    .slice(pagesVisited, pagesVisited + blogsPerPage)
    .map((blog) => {
      return (
        <Grid item xs={12} sm={4} md={4} lg={4} key={blog.blogId}>
          <Paper>
            <Link
              key={blog.blogId}
              href={`/community/${blog.gameSlug}/${blog.uid}/${blog.blogId}`}
            >
              <Card>
                <CardMedia
                  component="img"
                  height="194"
                  image="imageDien/img/download.jpg"
                  alt="Paella dish"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {blog.content}
                  </Typography>
                </CardContent>

                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      <img src={blog.photoURL} alt="blog.photoURL" />
                    </Avatar>
                  }
                  action={
                    <CardActions disableSpacing>
                      <p>{blog.karma}</p>
                      <FavoriteIcon />
                    </CardActions>
                  }
                  title={blog.title}
                  subheader={blog.createdAt}
                />
              </Card>
            </Link>
          </Paper>
        </Grid>
      );
    });

  const pageCount = Math.ceil(blogs.length / blogsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <CardMedia
        component="img"
        height="430"
        image="https://firebasestorage.googleapis.com/v0/b/rinc-store-game-4e114.appspot.com/o/uploads%2Fimages%2Fbanner%2Fconsole-community-neon-style-banner-gamepad-brick-background-videogame-game-club-leisure-can-be-used-advertising-street-203960011.jpg?alt=media&token=330e210b-bf63-4982-a291-9eebdf683b8f"
        alt="Paella dish"
      />
      <div className={style.container}>
        <h3>Featured post</h3>
        <Slider {...newsblog}>
          {blogsDesc?.map((blog) => {
            return (
              <Link
                key={blog.blogId}
                href={`/community/${blog.gameSlug}/${blog.uid}/${blog.blogId}`}
              >
                <Card>
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <CardMedia
                          component="img"
                          height="264"
                          image="imageDien/img/download.jpg"
                          alt="Paella dish"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CardHeader
                          avatar={
                            <Avatar
                              sx={{ bgcolor: red[500] }}
                              aria-label="recipe"
                            >
                              <img src={blog.photoURL} alt="blog.photoURL" />
                            </Avatar>
                          }
                          title={blog.title}
                          subheader={blog.createdAt}
                        />
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            {blog.content}
                          </Typography>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Link>
            );
          })}
        </Slider>

        <h3>News post</h3>
        <Grid container justify="flex-start" spacing={1}>
          {blogsDesc?.map((blog) => {
            return (
              <Grid item xs={12} sm={6} md={6} lg={6} key={blog.blogId}>
                <Paper>
                  <Link
                    key={blog.blogId}
                    href={`/community/${blog.gameSlug}/${blog.uid}/${blog.blogId}`}
                  >
                    <Card>
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{ bgcolor: red[500] }}
                            aria-label="recipe"
                          >
                            <img src={blog.photoURL} alt={blog.photoURL} />
                          </Avatar>
                        }
                        title={blog.title}
                        subheader={blog.createdAt}
                      />
                      <CardMedia
                        component="img"
                        height="194"
                        image="imageDien/img/download.jpg"
                        alt="Paella dish"
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {blog.content}
                        </Typography>
                      </CardContent>
                      <CardActions
                        disableSpacing
                        sx={{ justifyContent: "flex-end" }}
                      >
                        <p>{blog.karma}</p>
                        <FavoriteIcon />
                      </CardActions>
                    </Card>
                  </Link>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
        <h3>Recomend post</h3>
        <Slider {...settingsfeatured}>
          {blogsDesc?.map((blog) => {
            return (
              <Link
                key={blog.blogId}
                href={`/community/${blog.gameSlug}/${blog.uid}/${blog.blogId}`}
              >
                <Card sx={{ maxWidth: 345 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        <img src={blog.photoURL} alt="blog.photoURL" />
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={blog.title}
                    subheader={blog.createdAt}
                  />
                  <CardMedia
                    component="img"
                    height="194"
                    image="imageDien/img/download.jpg"
                    alt="Paella dish"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {blog.content}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <p>{blog.karma}</p>
                    <FavoriteIcon />
                  </CardActions>
                </Card>
              </Link>
            );
          })}
        </Slider>
        <h3>All post</h3>
        <Grid container justify="flex-start" spacing={1}>
          {displayblogs}
        </Grid>
        <Grid container justify="flex-center" spacing={1}>
          <ReactPaginate
            previousLabel={style.Previous}
            nextLabel={style.Next}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={style.paginationBttns}
            previousLinkClassName={style.previousBttn}
            nextLinkClassName={style.nextBttn}
            disabledClassName={style.paginationDisabled}
            activeClassName={style.paginationActive}
          />
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default Index;
