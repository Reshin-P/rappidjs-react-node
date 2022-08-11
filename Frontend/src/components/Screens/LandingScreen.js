import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";

import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Collapse from "@mui/material/Collapse";
import { red } from "@mui/material/colors";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./LandingScreen.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Icon from "@mui/material/Icon";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import { ButtonBase } from "@mui/material";
import axios from "../../util/axiosConfig.js";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const LandingScreen = () => {
  const Input = styled("input")({
    display: "none",
  });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const navigate = useNavigate();
  const arr = [1, 2, 34, 5, 6, 7, 8, 7];
  const [expanded, setExpanded] = useState(false);
  const [allPaper, setAllpaper] = useState([]);
  const [paperBackground, setPaperBackground] = useState(
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJ2LTQiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzIGlkPSJ2LTMiPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3QgaWQ9InYtNSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI0FBQUFBQSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgaWQ9InYtNyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuXzApIi8+PC9zdmc+"
  );
  const [paperName, setPaperName] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const HandlerLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };
  useEffect(() => {
    let user = localStorage.getItem("loggedIn");
    if (!user) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    console.log("hi");
    const fetchData = async () => {
      const { data } = await axios.get("/paper");
      console.log(data);
      setAllpaper(data);
    };
    fetchData();
  }, []);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const uploadBackground = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("reached");
    const formData = new FormData();
    formData.set("name", paperName);
    formData.set("background", paperBackground);
    console.log(paperName);
    try {
      let { data } = await axios.post("/paper", formData);
      setOpen(false);
      allPaper.push(data);
      setLoading(false);
      setPaperBackground(data.image);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div className="MainDiv">
      <div className="tools">
        <h1>NEO SILICA DRAW TOOL</h1>
        <Button
          style={{ height: "40px", marginTop: "10px" }}
          variant="contained"
          onClick={HandlerLogout}
        >
          Logout
        </Button>
      </div>
      <div className="Seconddiv">
        <div className="leftDiv">
          <div className="leftInner">
            <div className="paperhead">
              Create Floor
              <Icon
                onClick={handleOpen}
                baseClassName="material-icons-two-tone"
              >
                add_circle
              </Icon>
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className="modalInner">
                  <h4>Choose Default</h4>
                  <input type={"radio"}></input>
                </div>
                <form onSubmit={uploadBackground}>
                  <div className="modalInner">
                    <h4 className="mt-3">Paper Name</h4>
                    <input
                      type={"text"}
                      onChange={(e) => {
                        setPaperName(e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="modalInner">
                    <h4 className="mt-3">Choose Bckground</h4>

                    <label className="mt-3" htmlFor="icon-button-file">
                      <Input
                        accept="image/*"
                        onChange={(e) => {
                          console.log(e.target.files);
                          setPaperBackground(e.target.files[0]);
                        }}
                        id="icon-button-file"
                        type="file"
                      />

                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </div>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      style={{ marginLeft: "200px", marginTop: "10px" }}
                    >
                      Crete
                    </Button>
                  )}
                </form>
              </Box>
            </Modal>
          </div>
        </div>
        <div className="rightDiv">
          <Row style={{ width: "90%" }}>
            {allPaper.map((item) => (
              <Col className="mt-3" sm={1} md={3} xl={2}>
                <Card sx={{ maxWidth: 250 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={item.name}
                    subheader="September 14, 2016"
                  />
                  <CardMedia
                    component="img"
                    height="194"
                    image={item.image}
                    alt="Paella dish"
                  />
                  <CardContent></CardContent>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                      <Link to={`/paper/${item._id}`}>
                        {" "}
                        <OpenInNewIcon />
                      </Link>
                    </IconButton>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    ></ExpandMore>
                  </CardActions>
                  <Collapse
                    in={expanded}
                    timeout="auto"
                    unmountOnExit
                  ></Collapse>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
