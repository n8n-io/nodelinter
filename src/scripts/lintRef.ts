import { LINTINGS } from "../lintings";
import { Presenter } from "../services";

Presenter.printJson("lintRef", Object.keys(LINTINGS));
