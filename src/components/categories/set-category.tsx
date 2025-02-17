import { Button, Center, Group, Loader, Stack } from "@mantine/core";

import { useOverpass } from "../../queries";
import { notifications } from "@mantine/notifications";
import { useCategory } from "../../context-reducer/context";
import { useEffect, useMemo } from "react";
import { IconChevronRight } from "@tabler/icons-react";

export const SetCategory = ({
  lat,
  lng,
  close,
  opened,
}: {
  lat: number;
  lng: number;
  close: () => void;
  opened: boolean;
}) => {
  const { state, dispatch } = useCategory();
  const { data, isSuccess, isError, isLoading, refetch, error } = useOverpass({
    lat,
    lng,
    radius: state.radius,
  });

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
      [...new Set(data?.elements.map((element) => element.tags.amenity))].map(
        (category) => ({
          label: category
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          value: String(category),
        })
      ),
    [data]
  );
  useEffect(() => {
    if (isSuccess && categories.length > 0) {
      dispatch({ type: "SET_CATEGORIES", payload: categories });
    }
  }, [isSuccess, categories, dispatch, state.radius]);
  

  return (
    <>
      {opened && (
        <>
          {isLoading && (
            <Center mt={10}>
              <Loader />
            </Center>
          )}
          {isError && <Button onClick={() => refetch()}>Try Again</Button>}
          {isSuccess && !isLoading && categories && (
            <>
              <div className="h-5"></div>
              <div className="w-full md:w-96 h-[70vh] overflow-scroll z-50">
                <Stack
                  className="w-full bg-slate-100 border rounded-lg p-3"
                  gap={10}
                >
                  {[{label : 'All', value : 'all'},...categories].map((category, index) => (
                    <Group
                      key={index}
                      wrap="nowrap"
                      align="center"
                      onClick={() => {
                        dispatch({ type: "SET_CATEGORY", payload: category });
                        close();
                      }}
                      gap={2}
                      className="border p-2 lg:p-3 rounded-md cursor-pointer"
                      bg={
                        state.selectedCategory?.label === category.label
                          ? "#cbcece"
                          : "#fff"
                      }
                    >
                      <IconChevronRight />
                      {category.label}
                    </Group>
                  ))}
                </Stack>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};
