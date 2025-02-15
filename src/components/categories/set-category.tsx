import {
  Button,
  Center,
  Grid,
  Group,
  Loader,
 
} from "@mantine/core";

import { useOverpass } from "../../queries";
import { notifications } from "@mantine/notifications";
import { useCategory } from "../../context-reducer/context";
import { useEffect, useMemo } from "react";
import { IconChevronRight } from "@tabler/icons-react";

export const SetCategory = ({
  lat,
  lng,
  close,
}: {
  lat: number;
  lng: number;
  close: () => void;
}) => {
  const { data, isSuccess, isError, isLoading, refetch, error } = useOverpass({
    lat,
    lng,
  });
  console.log(data);
  const { state, dispatch } = useCategory();
  console.log(state);

  if (isError) {
    notifications.show({
      title: "Error",
      message: error.message,
      color: "red",
    });
  }
  console.log(error);

  const categories = useMemo(
    () =>
      [
        ...new Set(
          data?.elements
            // .filter((element) => element.tags.name)
            .map((element) => element.tags.amenity)
        ),
      ].map((category) => ({
        label: category
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value: String(category),
      })),
    [data]
  );
  useEffect(() => {
    if (isSuccess && categories.length > 0) {
      dispatch({ type: "SET_CATEGORIES", payload: categories });
    }
  }, [isSuccess, categories, dispatch]);

  return (
    <>
      {isLoading && (
        <Center mt={10}>
          <Loader />
        </Center>
      )}
      {isError && <Button onClick={() => refetch()}>Try Again</Button>}
      {isSuccess && !isLoading && categories && (
        <div className="w-full h-[70vh] overflow-scroll">
          <Grid className="w-full" gutter={"xs"} pt={10}>
            {[{ label: "All", value: "all" }, ...categories].map(
              (category, index) => (
                <Grid.Col
                  span={{ base: 6, sm: 4, md: 3, lg: 2, xl: 12 / 7 }}
                  key={index}
                  py={0}
                >
                  <Group
                    wrap="nowrap"
                    align="center"
                    onClick={() => {
                      dispatch({ type: "SET_CATEGORY", payload: category });
                      close()
                    }}
                    gap={2}
                    className="border my-2 p-2 lg:p-3 rounded-md cursor-pointer"
                    bg={
                      state.selectedCategory.label === category.label
                        ? "red"
                        : "#fff"
                    }
                  >
                    <IconChevronRight />
                    {category.label}
                  </Group>
                </Grid.Col>
              )
            )}
          </Grid>
        </div>
      )}
    </>
  );
};
