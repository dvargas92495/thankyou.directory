const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const readDir = (s) =>
  fs
    .readdirSync(s, { withFileTypes: true })
    .flatMap((f) =>
      f.isDirectory() ? readDir(path.join(s, f.name)) : [path.join(s, f.name)]
    );

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
});
const cloudfront = new AWS.CloudFront({
  apiVersion: "2020-05-31",
});

const waitForCloudfront = (props) =>
  new Promise() <
  string >
  ((resolve) => {
    const { trial = 0, ...args } = props;
    cloudfront
      .getInvalidation(args)
      .promise()
      .then((r) => r.Invalidation.Status)
      .then((status) => {
        if (status === "Completed") {
          resolve("Done!");
        } else if (trial === 60) {
          resolve("Ran out of time waiting for cloudfront...");
        } else {
          setTimeout(
            () => waitForCloudfront({ ...args, trial: trial + 1 }),
            1000
          );
        }
      });
  });

Promise.all(
  readDir("out").map((p) => {
    const Key = p.substring("out/".length);
    const uploadProps = {
      Bucket: "thankyou.directory",
      ContentType: mime.lookup(Key) || undefined,
    };
    console.log(`Uploading ${p} to ${Key}...`);
    return s3
      .upload({
        Key,
        ...uploadProps,
        Body: fs.createReadStream(p),
      })
      .promise();
  })
)
  .then(() =>
    cloudfront
      .createInvalidation({
        DistributionId: r.data.distributionId,
        InvalidationBatch: {
          CallerReference: today.toJSON(),
          Paths: {
            Quantity: 1,
            Items: [`/*`],
          },
        },
      })
      .promise()
      .then((i) => ({
        Id: i.Invalidation.Id,
        DistributionId: r.data.distributionId,
      }))
  )
  .then(waitForCloudfront)
  .then((msg) => console.log(msg))
  .then(() => 0);
