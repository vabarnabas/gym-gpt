import Head from "next/head";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useSWR from "swr/immutable";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type FormValues = {
  muscleFocuses: string[];
  workoutFocus: string;
  generatedAmount: number;
  includedExercises: string[];
  excludedExercises: string[];
};

export default function Home() {
  const [canFetch, setCanFetch] = useState(false);
  const { data, isLoading, mutate, error } = useSWR(
    "api",
    async () => {
      const url = "https://api.openai.com/v1/chat/completions";
      const body = {
        max_tokens: 500,
        temperature: 0.5,
        top_p: 0.5,
        n: 1,
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
      Create a response by the following parameters, only return the data, no explanation or any other text

      - An optimal workout routine that targets the following: ${getValues(
        "muscleFocuses"
      )}
      - The main focus of the workout is: ${getValues("workoutFocus")}
      - Generate at least this amount of exercises: [10]
      - Include the following exercises: []
      - Exclude the following exercises: [chin-ups]

      The JSON format is the following

      [
        {
          "name": string
          "muscleFocus": string[]
          "reps": number
          "sets": number
        }
      ]

    Format it as JSON not plain text
    `,
          },
        ],
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      };
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers,
      });
      const data = await response.json();

      return data;
    },
    { isPaused: () => !canFetch }
  );

  useEffect(() => {
    const getData = async () => {
      await mutate();
    };

    getData();
  }, [canFetch, mutate]);

  useEffect(() => {
    if (canFetch && data) {
      setCanFetch(false);
    }
  }, [canFetch, data]);

  const muscleFocuses = [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Forearms",
    "Abdominals",
    "Glutes",
    "Quadriceps",
    "Hamstrings",
    "Calves",
  ];
  const workoutFocuses = ["strength", "hypertrophy", "endurance"];

  const [currentPage, setCurrentPage] = useState(0);
  const form = useForm<FormValues>({
    defaultValues: {
      muscleFocuses: [],
      excludedExercises: [],
      includedExercises: [],
    },
  });
  const { watch, getValues, setValue } = form;

  watch("muscleFocuses");

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-background-primary text-white font-roboto select-none">
      <Head>
        <title>GymGPT</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="fixed bottom-0 inset-x-0 flex items-center justify-center py-2 bg-background-primary">
        <p className="text-xs ">GymGPT is powered by ChatGPT.</p>
      </div>
      <div className="flex flex-col items-center py-12">
        <p className="font-gym text-5xl text-center">
          Welcome to <span className="text-amber-500 inline">GymGPT</span>!
        </p>
        <p className="font-medium mt-1 text-center">
          Let us help you to create the best exercise
        </p>

        {(() => {
          switch (currentPage) {
            case 1:
              return (
                <div className="">
                  <p className="mt-6 font-semibold text-2xl w-full text-center">
                    Select Muscle Focuses
                  </p>
                  {getValues("muscleFocuses").length !== 0 ? (
                    <div className="">
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        {getValues("muscleFocuses").map((focus) => (
                          <div
                            key={focus}
                            onClick={() => {
                              getValues("muscleFocuses").includes(focus)
                                ? setValue(
                                    "muscleFocuses",
                                    getValues("muscleFocuses").filter(
                                      (item) => item !== focus
                                    )
                                  )
                                : setValue("muscleFocuses", [
                                    ...getValues("muscleFocuses"),
                                    focus,
                                  ]);
                            }}
                            className="bg-background-secondary hover:bg-background-tertiary px-4 font-semibold py-1 flex items-center justify-center rounded-full cursor-pointer"
                          >
                            {focus}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {getValues("muscleFocuses").length !== 0 ? (
                    <div className="h-0.5 bg-amber-500 my-6"></div>
                  ) : null}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {muscleFocuses
                      .filter(
                        (item) => !getValues("muscleFocuses").includes(item)
                      )
                      .map((focus) => (
                        <div
                          key={focus}
                          onClick={() => {
                            getValues("muscleFocuses").includes(focus)
                              ? setValue(
                                  "muscleFocuses",
                                  getValues("muscleFocuses").filter(
                                    (item) => item !== focus
                                  )
                                )
                              : setValue("muscleFocuses", [
                                  ...getValues("muscleFocuses"),
                                  focus,
                                ]);
                          }}
                          className="bg-background-secondary hover:bg-background-tertiary px-4 font-semibold py-1 flex items-center justify-center rounded-full cursor-pointer"
                        >
                          {focus}
                        </div>
                      ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(2)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-full font-semibold mt-6 w-full"
                  >
                    Continue
                  </button>
                </div>
              );
            case 2:
              return (
                <div className="">
                  <p className="mt-6 font-semibold text-xl">
                    What is your focus?
                  </p>
                  <div className="">
                    {workoutFocuses.map((focus) => (
                      <div
                        key={focus}
                        onClick={async () => {
                          await setValue("workoutFocus", focus);
                          setCanFetch(true);
                          setCurrentPage(3);
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center capitalize cursor-pointer font-semibold mt-6 w-full"
                      >
                        {focus}
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 3:
              return (
                <div className="mt-6">
                  {!isLoading ? (
                    data && !error ? (
                      <div className="">
                        <div className="gap-y-4 grid sm:grid-cols-2 gap-4">
                          {JSON.parse(data.choices[0].message.content).map(
                            (result: any) => (
                              <div
                                className="bg-background-secondary rounded-full py-2 px-4 flex justify-between gap-x-6 font-semibold w-full"
                                key={result.name}
                              >
                                <p className="text-amber-500">{result.name}</p>
                                <p className="">{`${result.sets}x${result.reps}`}</p>
                              </div>
                            )
                          )}
                        </div>
                        <p className="text-sm font-semibold mt-6 w-full flex gap-x-1 justify-center">
                          Tokens Used:
                          <span className="text-amber-500">
                            {data.usage.total_tokens}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="">
                        Something went wrong, please try again later.
                      </div>
                    )
                  ) : (
                    <p className="flex items-center justify-center gap-x-2 text-lg">
                      Generating
                      <AiOutlineLoading3Quarters className="animate-spin text-base" />
                    </p>
                  )}
                </div>
              );
            default:
              return (
                <div className="mt-6 flex flex-col items-center gap-y-6">
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-full font-semibold w-max"
                  >
                    Get Started!
                  </button>
                </div>
              );
          }
        })()}
      </div>
    </div>
  );
}
