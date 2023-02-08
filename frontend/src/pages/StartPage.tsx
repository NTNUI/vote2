import React from "react";
import { Button } from "@mantine/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Groups} from "../components/Groups";

export function StartPage() {
  return (
    <>
  <p data-testid="start-page-title">Start page</p>
  < Groups/>
  </>
  );
}
