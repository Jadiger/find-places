import { CiAlignLeft, CiForkAndKnife } from "react-icons/ci";
import {  Button, Group, Loader } from "@mantine/core";
import { Link } from "react-router";
import { useOverpass } from "../../queries";
import { notifications } from "@mantine/notifications";
export const Overpass = ({ lat, lng }: { lat: number; lng: number }) => {
  const { data, isSuccess,isError, isLoading ,refetch,error} = useOverpass({ lat, lng });
  console.log(data);
  
  if(isError) {
    notifications.show({
      title: "Error",
      message: error.message,
      color: "red",
    });
  }
console.log(error);

  const categories = [
    ...new Set(
      data?.elements
        .filter((element) => element.tags.name)
        .map((element) => element.tags.amenity)
    ),
  ]
    .map((category) => ({
      title: category
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      category: String(category),
    }))
    .map((category) => {
      if (category?.category.includes("restaurant")) {
        return { ...category, icon: <CiForkAndKnife size={20} /> };
      } else {
        return { ...category, icon: <CiAlignLeft size={20} /> };
      }
    })
  console.log(categories);

  return (
    <>
      {isLoading && (
        <div style={{ flexGrow: 1 }}>
          <Loader />
        </div>
      )}
      {isError && <Button onClick={()=> refetch()}>Try Again</Button>}
      {isSuccess &&
        !isLoading &&
        categories &&
        categories
          .sort((a,b)=> a.title.localeCompare(b.title))
          .map((item, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                border: "1px solid gray",
                padding: "5px 10px",
                borderRadius: "5px",
                zIndex: 100,
                flexShrink: 0,
              }}
            >
              <Link to={`/category/${item.category}`}>
                <Group wrap="nowrap">
                  {item.icon}
                  <b>{item.title}</b>
                </Group>
              </Link>
            </div>
          ))}
    </>
  );
};
