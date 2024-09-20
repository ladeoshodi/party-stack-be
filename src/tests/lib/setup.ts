import Movies from "../../models/movies";
import Users from "../../models/users";

function getMovieData(user: any) {
  return [
    {
      name: "Diehard",
      year: 1988,
      image:
        "https://m.media-amazon.com/images/M/MV5BZDViZDAzMjAtY2E1YS00OThkLWE2YTMtYzBmYWRjMWY0MDhkXkEyXkFqcGdeQXRzdGFzaWVr._V1_QL75_UY281_CR19,0,500,281_.jpg",
      user,
      comments: [
        {
          content: "This is a great movie.",
          user,
        },
      ],
    },
    {
      name: "The Grinch",
      year: 2000,
      image:
        "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/jim-carey-the-grinch-1665564473.jpg?crop=0.969xw:0.664xh;0,0.0444xh&resize=640:*",
      user,
    },
    {
      name: "Home Alone",
      year: 1990,
      image: "TODO find a good image",
      user,
    },
  ];
}

const userData = {
  username: "nick",
  email: "nick@nick.com",
  password: "helloworldA1$%",
};

export default async function setup() {
  const user = await Users.create(userData);
  const movieData = getMovieData(user._id);
  await Movies.create(movieData);
}
