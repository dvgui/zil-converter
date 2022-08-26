const express = require("express");
const { createServer } = require("http");
const morgan = require("morgan");


const { fromBech32Address, toBech32Address } = require('@zilliqa-js/crypto');
const { isBech32, isAddress } = require('@zilliqa-js/util/dist/validation');

// Server Variables

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));
app.get("/", (req,res) => {
  res.send(200).send('Allowed endpoints are /fromb16 and /fromb32')
})

app.post("/fromb16", (req, res) => {
  const from = req.body.address;
  let converted = [];
  if (from) {
    if (Array.isArray(from)){
      for (let row of from){
        if (isAddress(row)){
          converted.push(toBech32Address(row))
        } else {
          res.status(201).send('Status: invalid address found ' + row);
          return;
        }
      }
      res.status(200).json({address: converted});
    } else {
      if (isAddress(from)) {
      res.status(200).json({address: toBech32Address(from)});
      } else {
        res.status(400).send('Status: invalid address ' + from);
      }
    }
  } else {
    res.status(400).send('Status: no address provided');
  }
});
app.post("/fromb32", (req, res) => {
  const from = req.body.address;
  let converted = [];
  if (from){


    if (Array.isArray(from)){
      for (let row of from){
        if (isBech32(row)){
          converted.push(fromBech32Address(row))
        } else {
          res.status(201).send('Status: invalid address found ' + row);
          return;
        }
      }
      res.status(200).json({address: converted});
    } else {
      if (isBech32(from)) {
      res.status(200).json({address: fromBech32Address(from)});
      } else {
        res.status(400).send('Status: invalid address ' + from);
      }
    }
  } else {
    res.status(400).send('Status: no address provided');
  }
});

const srv = server.listen(PORT, () => {
  const addr = server.address();
  const binding = srv.address().port;
  console.log(`Http server listening in ${binding}`);
});

srv.on("error", (error) => console.log(`Server error ${error}`));
