import type { NextPage } from "next";
import Head from "next/head";
import {
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Box,
  Spacer,
  Spinner
} from "@chakra-ui/react";
import React from "react";
import { load } from "../src/funcs";

const Home: NextPage = () => {
  const [input, setInput] = React.useState<string>("");
  const [refresh, setRefresh] = React.useState<boolean>(true);
  const [addressAccount, setAddresAccount] = React.useState<any>(null);
  const [contract, setContract] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<any[]>([]);

  const handleInputChange = (e: any) => setInput(e.currentTarget.value);
  const handleAddTask = async () => {
    await contract.createTask(input, { from: addressAccount });
    setInput("");
    setRefresh(true);
  };
  const handleToggled = async (id: number) => {
    await contract.toggleCompleted(id, { from: addressAccount });
    setRefresh(true);
  };

  React.useEffect(() => {
    if (!refresh) return;
    setRefresh(false);
    load().then((e) => {
      setAddresAccount(e.addressAccount);
      setTasks(e.tasks);
      setContract(e.todoContract);
    });
  });

  return (
    <VStack>
      <Head>
        <title>Todo List</title>
        <meta name="description" content="Blockchain TodoList." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HStack w="full">
        <Spacer />
        <VStack>
          <Heading>Blockchain TodoList</Heading>
          <Box h="30px" />
          <HStack w="md">
            <Input
              type="text"
              size="md"
              placeholder="Nueva tarea..."
              onChange={handleInputChange}
              value={input}
            />
            <Button onClick={handleAddTask} bg="green.200">
              Agregar
            </Button>
          </HStack>
          <Box h="30px" />
          <Text>Pendientes</Text>
          {tasks == null ? (
            <Spinner />
          ) : (
            tasks.map((task, idx) =>
              !task[2] ? (
                <HStack key={idx} w="md" bg="gray.100" borderRadius={7}>
                  <Box w="5px" />
                  <Text>{task[1]}</Text>
                  <Spacer />
                  <Button
                    bg="green.300"
                    onClick={() => handleToggled(task[0].toNumber())}
                  >
                    Listo
                  </Button>
                </HStack>
              ) : null
            )
          )}
          <Box h="10px" />
          <Text>Tareas terminadas</Text>
          {tasks == null ? (
            <Spinner />
          ) : (
            tasks.map((task, idx) =>
              task[2] ? (
                <HStack key={idx} w="md" bg="gray.100" borderRadius={7}>
                  <Box w="5px" />
                  <Text>{task[1]}</Text>
                  <Spacer />
                  <Button
                    bg="red.300"
                    onClick={() => handleToggled(task[0].toNumber())}
                  >
                    Deshacer
                  </Button>
                </HStack>
              ) : null
            )
          )}
        </VStack>
        <Spacer />
      </HStack>
    </VStack>
  );
};

export default Home;
